<?php

namespace App\Imports;

use App\Helpers;
use App\Models\ImportProcess;
use App\Models\SchoolStaff;
use App\Models\StaffEmergencyContact;
use App\Models\StaffImportFailed;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\{DB, File};
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Exception;

class StaffImport implements ToCollection, WithHeadingRow, WithChunkReading
{
    protected $admin;
    protected $guard;
    protected $school;
    protected $schoolSession;
    protected $cacheKey;
    protected $fileMap;
    protected $staffPhotoDir;
    protected $progress;
    protected $zipFilePath;

    public function __construct($admin, $guard, $school, $schoolSession, $cacheKey, $fileMap = [], $zipFilePath = null)
    {
        $this->admin         = $admin;
        $this->guard         = $guard;
        $this->school        = $school;
        $this->schoolSession = $schoolSession;
        $this->cacheKey      = $cacheKey;
        $this->fileMap       = $fileMap ?? [];
        $this->zipFilePath   = $zipFilePath;

        $prefix = $this->school->folder_prefix ?? ($this->school->school_prefix ?? 'school');
        $this->staffPhotoDir = storage_path("app/public/{$prefix}_staff_photo");
        File::ensureDirectoryExists($this->staffPhotoDir);

        $this->progress = ImportProcess::firstOrCreate(
            ['auth_id' => $this->admin->id, 'type' => 'staff'],
            ['total' => 0, 'success' => 0, 'failed' => 0, 'failed_rows' => []]
        );
    }

    public function collection(Collection $rows)
    {
        $this->progress->refresh();
        $this->progress->total += $rows->count();
        $this->progress->save();

        foreach ($rows as $row) {
            $data = $this->normalizeRow($row);

            DB::beginTransaction();
            try {
                if (empty($data['staff_name'])) {
                    throw new Exception('Missing Staff Name');
                }

                $exists = SchoolStaff::where('school_id', $this->school->id)
                    ->whereRaw('LOWER(TRIM(name)) = ?', [strtolower(trim($data['staff_name']))])
                    ->exists();

                if ($exists) {
                    throw new Exception("Duplicate staff: {$data['staff_name']}");
                }

                // Handle photo movement
                $moved = $this->preparePhotosForRow($data);

                // Create staff record
                $staff = SchoolStaff::create([
                    'uuid'              => Str::uuid(),
                    'unique_id'         => Helpers::shortUuid(),
                    'school_id'         => $this->school->id,
                    'school_session_id' => $this->schoolSession->id,
                    'auth_id'           => $this->admin->id,
                    'name'              => $data['staff_name'],

                    'employee_id'       => $data['employee_id'],
                    'national_code'     => $data['national_code'],
                    'department'        => $data['Department'],
                    'designation'       => $data['Designation'],
                    'date_of_joining'   => $data['date_of_joining'],
                    'gender'            => $data['gender'],

                    'dob'               => $data['dob'],
                    'blood_group'       => $data['blood_group'],
                    'email'             => $data['email'],
                    'phone'             => $data['phone'],
                    'whatsapp_phone'    => $data['whatsapp_phone'],
                    'father_name'       => $data['father_name'],
                    'mother_name'       => $data['mother_name'],
                    'husband_name'      => $data['husband_name'],
                    'photo'             => $moved['photo'] ?? null,
                    'address'           => $data['address'],
                    'pincode'           => $data['pincode'],
                    'password'          => '123456',
                ]);

                // ✅ Save emergency contact
                if (!empty($data['emergency_contact_name']) || !empty($data['emergency_contact_no'])) {
                    StaffEmergencyContact::create([
                        'school_staff_id' => $staff->id,
                        'school_id'       => $this->school->id,
                        'name'            => $data['emergency_contact_name'],
                        'phone'           => $data['emergency_contact_no'],
                        'relation'        => $data['emergency_contact_relation'],
                    ]);
                }

                DB::commit();
                $this->progress->increment('success');
            } catch (Exception $e) {
                DB::rollBack();
                $this->progress->increment('failed');
                $failed = $this->progress->failed_rows ?? [];
                $failed[] = [
                    'name'  => $data['staff_name'] ?? '',
                    'phone' => $data['phone'] ?? '',
                    'error' => $e->getMessage(),
                ];
                $this->progress->failed_rows = $failed;
                $this->progress->save();

                StaffImportFailed::create([
                    'auth_id'   => $this->admin->id,
                    'school_id' => $this->school->id,
                    'auth_type' => $this->guard,
                    'data'      => $data,
                    'status'    => 0,
                    'reason'    => $e->getMessage(),
                ]);
            }
        }

        $this->progress->save();
    }

    protected function preparePhotosForRow(array $data)
    {
        $moved = [];
        $value = $data['photo'] ?? null;

        if (!$value) return $moved;

        $baseName = strtolower(pathinfo($value, PATHINFO_FILENAME));
        $possibleKeys = [$baseName, "{$baseName}.jpg", "{$baseName}.jpeg", "{$baseName}.png"];

        foreach ($possibleKeys as $key) {
            if (isset($this->fileMap[$key])) {
                $newFileName = strtolower($baseName . '-' . Helpers::shortUuid() . '.' . pathinfo($this->fileMap[$key], PATHINFO_EXTENSION));
                $targetDir = $this->staffPhotoDir;
                File::ensureDirectoryExists($targetDir);
                $zip = new \ZipArchive;
                if ($zip->open($this->zipFilePath) === true) {
                    if ($zip->locateName($this->fileMap[$key]) !== false) {
                        copy("zip://{$this->zipFilePath}#{$this->fileMap[$key]}", "{$targetDir}/{$newFileName}");
                        $moved['photo'] = $newFileName;
                    }
                    $zip->close();
                }
                break;
            }
        }

        return $moved;
    }

    protected function normalizeRow($row)
    {
        $normalized = [];
        $map = [
            'staff_name'                => ['staff_name'],
            'employee_id'               => ['employee_id'],
            'national_code'             => ['national_code'],
            'department'                => ['Department'],
            'designation'               => ['Designation'],
            'date_of_joining'           => ['date_of_joining'],
            'gender'                    => ['gender'],
            'dob'                       => ['dob'],
            'blood_group'               => ['blood_group'],
            'email'                     => ['email'],
            'phone'                     => ['phone_no', 'phone'],
            'whatsapp_phone'            => ['whatsapp_no', 'whatsapp_phone'],
            'father_name'               => ['father_name'],
            'mother_name'               => ['mother_name'],
            'husband_name'              => ['husband_name'],
            'photo'                     => ['photo'],
            'address'                   => ['address'],
            'pincode'                   => ['pincode'],
            'emergency_contact_name'    => ['emergency_contact_name'],
            'emergency_contact_relation' => ['emergency_contact_relation'],
            'emergency_contact_no'      => ['emergency_contact_no'],
        ];

        foreach ($map as $key => $aliases) {
            foreach ($aliases as $alias) {
                if (isset($row[$alias]) && $row[$alias] !== null && $row[$alias] !== '') {
                    $normalized[$key] = is_string($row[$alias]) ? trim($row[$alias]) : $row[$alias];
                    break;
                }
            }
            if (!isset($normalized[$key])) $normalized[$key] = null;
        }

        return $normalized;
    }

    public static function collectRequiredFiles(Collection $rows): array
    {
        $required = [];
        foreach ($rows as $row) {
            $value = $row['photo'] ?? null;
            if ($value) {
                $baseName = strtolower(pathinfo($value, PATHINFO_FILENAME));
                $required[] = $baseName;
                foreach (['jpg', 'jpeg', 'png'] as $ext) {
                    $required[] = "{$baseName}.{$ext}";
                }
            }
        }
        return array_unique($required);
    }

    public function chunkSize(): int
    {
        return 100;
    }
}
