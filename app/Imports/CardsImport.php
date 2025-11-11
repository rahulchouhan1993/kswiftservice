<?php

namespace App\Imports;

use App\Helpers;
use App\Jobs\GenerateBarcode;
use App\Models\Card;
use App\Models\CardImportLog;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Imports\HeadingRowFormatter;

class CardsImport implements ToModel, WithHeadingRow, WithChunkReading, WithBatchInserts
{
    protected $imageSourcePath, $role, $branchId, $creatorId;

    protected int $successCount = 0;
    protected int $failCount = 0;

    public function __construct($imageSourcePath, $role)
    {
        HeadingRowFormatter::default('none');

        $auth = Auth::user();
        $this->imageSourcePath = $imageSourcePath;
        $this->role = strtolower($role);
        $this->branchId = $auth->branch_id;
        $this->creatorId = $auth->id;
    }


    public function model(array $row)
    {
        if (empty($row['Name'])) return null;

        DB::beginTransaction();

        try {
            $emergencyContacts = $this->parseCsvLines($row['Emergency Contacts'] ?? '', 3, ['relation', 'name', 'phone']);
            $vehicles = $this->parseCsvLines($row['Vehicle Details'] ?? '', 3, ['type', 'number', 'quantity', 'document'], true);
            $cardRequirements = $this->parseCsvLines($row['Card Requirements'] ?? '', 2, ['card_type', 'quantity']);

            $this->processFiles([$row['Photo'] ?? null => 'users_photos', $row['Signature'] ?? null => 'users_signatures']);

            foreach ($vehicles as &$vehicle) {
                if (!empty($vehicle['document'])) {
                    $vehicle['document'] = $this->processVehicleDocument($vehicle);
                }
            }

            $data = [
                'name' => $row['Name'],
                'enrollment_number' => $row['Enrollment No'],
                'phone' => $row['Mobile No'],
                'email' => $row['Email'],
                'father_name' => $row['Father Name'] ?? null,
                'husband_name' => $row['Husband Name'] ?? null,
                'address' => $row['Address'] ?? null,
                'parent_option' => $row['Parent Option'] ?? null,
                'date_of_birth' => $row['Date Of Birth'] ?? null,
                'blood_group' => $row['Blood Group'] ?? null,
                'date_of_membership' => $row['Date Of Membership'] ?? null,
                'emergency_contacts' => $emergencyContacts,
                'vehicles' => $vehicles,
                'card_requirements' => $cardRequirements,
                'designation' => $row['Designation'] ?? null,
                'photo' => $row['Photo'] ?? null,
                'signature' => $row['Signature'] ?? null,
            ];

            $user = User::firstOrCreate(
                [
                    ['enrollment_number', '=', $row['Enrollment No']],
                    ['email', '=', $row['Email']],
                    ['phone', '=', $row['Mobile No']],
                ],
                [
                    'branch_id' => $this->branchId,
                    'enrollment_number' => $row['Enrollment No'],
                    'role' => $this->role,
                    'name' => $row['Name'],
                    'email' => $row['Email'],
                    'phone' => $row['Mobile No'],
                    'profile_pic' => $row['Photo'],
                    'signature_photo' => $row['Signature'],
                    'password' => trim(strtolower(str_replace(' ', '', $row['Name']))) . '@123#',
                ]
            );

            $user->syncRoles([$this->role]);

            $card = Card::create([
                'user_id' => $user->id,
                'creator_id' => $this->creatorId,
                'data' => $data,
                'submission_status' => 'card_created',
                'submitted_at' => now()
            ]);
            // GenerateBarcode::dispatch($card);

            CardImportLog::create([
                'card_id' => $card->id,
                'user_id' => $user->id,
                'creator_id' => $this->creatorId,
                'enrollment_number' => $row['Enrollment No'],
                'name' => $row['Name'],
                'email' => $row['Email'],
                'phone' => $row['Mobile No'],
                'status' => 'success',
                'message' => 'Card created successfully'
            ]);

            DB::commit();
            $this->successCount++;
        } catch (Exception $e) {
            DB::rollBack();
            $this->failCount++;

            CardImportLog::create([
                'card_id' => null,
                'user_id' => isset($user) ? $user->id : null,
                'creator_id' => $this->creatorId,
                'enrollment_number' => $row['Enrollment No'] ?? null,
                'name' => $row['Name'] ?? null,
                'email' => $row['Email'] ?? null,
                'phone' => $row['Mobile No'] ?? null,
                'status' => 'failed',
                'message' => $e->getMessage()
            ]);
        }

        return null;
    }


    public function chunkSize(): int
    {
        return 500;
    }
    public function batchSize(): int
    {
        return 200;
    }

    private function processFiles(array $files)
    {
        foreach ($files as $file => $folder) {
            if (!$file) continue;
            $safeName = Str::limit(preg_replace('/[^\w\-\.]/', '', $file), 180, '');
            $sourcePath = $this->imageSourcePath . '/' . $safeName;

            if (File::exists($sourcePath)) {
                Storage::disk('public')->put("{$folder}/{$safeName}", File::get($sourcePath));
            }
        }
    }

    private function processVehicleDocument(array $vehicle)
    {
        $doc = $vehicle['document'];
        $originalName = basename($doc);
        $sourcePath = $this->imageSourcePath . '/' . $originalName;

        if (!File::exists($sourcePath)) return null;

        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        $newName = Str::slug($vehicle['number']) . '-' . Helpers::shortUuid() . '.' . strtolower($ext);

        Storage::disk('public')->put("users_vehicle_documents/{$newName}", File::get($sourcePath));

        return $newName;
    }

    private function parseCsvLines($string, $minCount, array $keys, $hasOptional = false)
    {
        $rows = [];
        $lines = array_filter(array_map('trim', explode("\n", trim($string ?? ''))));
        foreach ($lines as $line) {
            $parts = array_map('trim', explode(',', $line));
            if (count($parts) >= $minCount) {
                $item = [];
                foreach ($keys as $i => $key) {
                    $item[$key] = $parts[$i] ?? null;
                }
                $rows[] = $item;
            }
        }
        return $rows;
    }


    public function __destruct()
    {
        session([
            'card_import_success' => $this->successCount,
            'card_import_failed' => $this->failCount,
        ]);
    }
}
