<?php

namespace App\Imports;

use App\Helpers;
use App\Models\ImportFailed;
use App\Models\ImportProcess;
use App\Models\SchoolClass;
use App\Models\SchoolClassSection;
use App\Models\SchoolHouse;
use App\Models\SchoolSession;
use App\Models\Student;
use App\Models\StudentGurdian;
use App\Models\StudentParent;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\{DB, Cache, File, Log};
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Exception;

class StudentsImport implements ToCollection, WithHeadingRow, WithChunkReading
{
    protected $admin;
    protected $guard;
    protected $school;
    protected $schoolSession;
    protected $cacheKey;
    protected $fileMap;
    protected $classMap = [];
    protected $sectionMap = [];
    protected $houseMap = [];

    protected $studentPhotoDir;
    protected $studentSignDir;
    protected $parentPhotoDir;
    protected $parentSignDir;
    protected $guardianPhotoDir;
    protected $guardianSignDir;
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
        $this->studentPhotoDir   = storage_path("app/public/{$prefix}_students_photo");
        $this->studentSignDir    = storage_path("app/public/{$prefix}_students_sign");
        $this->parentPhotoDir    = storage_path("app/public/{$prefix}_parent_photos");
        $this->parentSignDir     = storage_path("app/public/{$prefix}_parent_signs");
        $this->guardianPhotoDir  = storage_path("app/public/{$prefix}_guardian_photo");
        $this->guardianSignDir   = storage_path("app/public/{$prefix}_guardian_sign");

        File::ensureDirectoryExists($this->studentPhotoDir);
        File::ensureDirectoryExists($this->studentSignDir);
        File::ensureDirectoryExists($this->parentPhotoDir);
        File::ensureDirectoryExists($this->parentSignDir);
        File::ensureDirectoryExists($this->guardianPhotoDir);
        File::ensureDirectoryExists($this->guardianSignDir);

        $this->seedLookupMaps();

        $this->progress = ImportProcess::firstOrCreate(
            ['auth_id' => $this->admin->id, 'type' => 'students'],
            ['total' => 0, 'success' => 0, 'failed' => 0, 'failed_rows' => []]
        );
    }

    protected function seedLookupMaps()
    {
        $this->classMap = SchoolClass::whereSchoolId($this->school->id)
            ->pluck('id', DB::raw('LOWER(TRIM(name_withPrefix))'))
            ->toArray();

        $this->sectionMap = SchoolClassSection::whereSchoolId($this->school->id)
            ->pluck('id', DB::raw('LOWER(TRIM(name))'))
            ->toArray();

        $this->houseMap = SchoolHouse::whereSchoolId($this->school->id)
            ->pluck('id', DB::raw('LOWER(TRIM(name))'))
            ->toArray();
    }

    public function collection(Collection $rows)
    {
        $this->progress->refresh();
        $this->progress->total += $rows->count();
        $this->progress->save();

        $studentBatch = [];
        $parentBatch = [];
        $guardianBatch = [];

        foreach ($rows as $row) {
            $data = $this->normalizeRow($row);

            try {
                if (empty($data['student_name'])) {
                    throw new Exception('Missing Student_Name');
                }

                $classId = $this->classMap[strtolower(trim($data['class'] ?? ''))] ?? null;
                if (!$classId) throw new Exception("Class not found: " . ($data['class'] ?? ''));

                $sectionId = !empty($data['section']) ? $this->sectionMap[strtolower(trim($data['section']))] ?? null : null;
                $houseId   = !empty($data['house'])   ? $this->houseMap[strtolower(trim($data['house']))] ?? null : null;

                $parentName = $data['father_name'] ?? $data['mother_name'] ?? null;
                $exists = Student::where('school_id', $this->school->id)
                    ->where('school_class_id', $classId)
                    ->whereRaw('LOWER(TRIM(name)) = ?', [strtolower(trim($data['student_name']))])
                    ->where(function ($q) use ($parentName) {
                        if ($parentName) {
                            $q->whereRaw('LOWER(TRIM(father_name)) = ?', [strtolower(trim($parentName))])
                                ->orWhereRaw('LOWER(TRIM(mother_name)) = ?', [strtolower(trim($parentName))]);
                        }
                    })
                    ->exists();

                if ($exists) {
                    throw new Exception("Duplicate student: {$data['student_name']} (class: {$data['class']})");
                }


                $moved = $this->preparePhotosForRow($data);

                $studentBatch[] = [
                    'uuid'                    => Str::uuid(),
                    'unique_id'               => Helpers::shortUuid(),
                    'school_id'               => $this->school->id,
                    'school_session_id'       => $this->schoolSession->id,
                    'school_class_id'         => $classId,
                    'school_class_section_id' => $sectionId,
                    'school_house_id'         => $houseId,
                    'uid_no'                  => $data['uid_no'] ?? null,
                    'sr_no'                   => $data['sr_no'] ?? null,
                    'pan_no'                  => $data['pan_no'] ?? null,
                    'name'                    => $data['student_name'],
                    'email'                   => $data['student_email_id'] ?? null,
                    'phone'                   => $data['student_contact_no'] ?? null,
                    'whatsapp_phone'          => $data['student_whatsapp_no'] ?? null,
                    'land_line_no'            => $data['land_line_no'] ?? null,
                    'dob'                     => $data['date_of_birth'] ?? null,
                    'gender'                  => $data['gender'] ?? null,
                    'blood_group'             => $data['blood_group'] ?? null,
                    'transport_mode'          => $data['transport_mode'] ?? null,
                    'reg_no'                  => $data['reg_no'] ?? null,
                    'roll_no'                 => $data['roll_no'] ?? null,
                    'aadhar_no'               => $data['aadhar_no'] ?? null,
                    'admission_no'            => $data['admission_no'] ?? null,
                    'rfid_no'                 => $data['rfid_card_no'] ?? null,
                    'address'                 => $data['student_address'] ?? null,
                    'pincode'                 => $data['pincode'] ?? null,
                    'login_id'                => ($this->school->school_prefix ?? '') . Helpers::shortUuid(),
                    'password'                => '123456',
                    'photo'                   => $moved['student_photo'] ?? null,
                    'signature'               => $moved['student_sign'] ?? null,
                    'father_name'             => $data['father_name'] ?? null,
                    'father_phone'            => $data['father_contact_no'] ?? null,
                    'father_photo'            => $moved['father_photo'] ?? null,
                    'father_signature'        => $moved['father_sign'] ?? null,
                    'mother_name'             => $data['mother_name'] ?? null,
                    'mother_phone'            => $data['mother_contact_no'] ?? null,
                    'mother_wphone'           => $data['mother_whatsapp_contact_no'] ?? null,
                    'mother_photo'            => $moved['mother_photo'] ?? null,
                    'mother_signature'        => $moved['mother_sign'] ?? null,

                    'student_nic_id'        => $moved['student_nic_id'] ?? null,
                    'caste'                 => $moved['caste'] ?? null,
                    'is_rte_student'        => $moved['is_rte_student'] ?? null,
                    'religion'              => $moved['religion'] ?? null,

                    // 'relation'                => $data['gurdian_relation'] ?? null,
                    // 'name'                    => $data['guardian_name'] ?? null,
                    // 'phone'                   => $data['guardian_contact_no'] ?? null,
                    // 'whatsapp_phone'          => $data['guardian_whatsapp_no'] ?? null,
                    // 'photo'                   => $moved['guardian_photo'] ?? null,
                    // 'signature'               => $moved['guardian_sign'] ?? null,
                    'created_at'              => now(),
                    'updated_at'              => now(),
                ];

                $this->progress->increment('success');
            } catch (Exception $e) {
                $this->progress->increment('failed');
                $failed = $this->progress->failed_rows ?? [];
                $failed[] = [
                    'student_name' => $data['student_name'] ?? '',
                    'father_name'  => $data['father_name'] ?? '',
                    'class'        => $data['class'] ?? '',
                    'error'        => $e->getMessage(),
                ];
                $this->progress->failed_rows = $failed;
                $this->progress->save();

                ImportFailed::create([
                    'auth_id'   => $this->admin->id,
                    'school_id' => $this->school->id,
                    'auth_type' => $this->guard,
                    'data'      => $data,
                    'reason'    => $e->getMessage(),
                ]);
            }
        }

        // bulk insert per chunk in one transaction
        DB::transaction(function () use ($studentBatch, $parentBatch, $guardianBatch) {
            if (!empty($studentBatch)) Student::insert($studentBatch);
            if (!empty($parentBatch)) StudentParent::insert($parentBatch);
            if (!empty($guardianBatch)) StudentGurdian::insert($guardianBatch);
        });

        $this->progress->save();
    }

    protected function preparePhotosForRow(array $data)
    {
        $moved = [];

        $map = [
            'student_photo'     => 'student_photo',
            'student_signature' => 'student_sign',
            'father_photo'      => 'father_photo',
            'father_signature'  => 'father_sign',
            'mother_photo'      => 'mother_photo',
            'mother_signature'  => 'mother_sign',
            'guardian_photo'    => 'guardian_photo',
            'guardian_signature' => 'guardian_sign',
        ];

        foreach ($map as $excelKey => $dbKey) {
            $value = $data[$excelKey] ?? null;
            if (!$value) continue;

            $baseName = strtolower(pathinfo($value, PATHINFO_FILENAME));

            $possibleKeys = [$baseName, "{$baseName}.jpg", "{$baseName}.jpeg", "{$baseName}.png"];

            foreach ($possibleKeys as $key) {
                if (isset($this->fileMap[$key])) {
                    // ✅ copy only when student is being inserted
                    $newFileName = strtolower($baseName . '-' . \App\Helpers::shortUuid() . '.' . pathinfo($this->fileMap[$key], PATHINFO_EXTENSION));

                    $targetDir = $this->studentPhotoDir; // or detect per type
                    File::ensureDirectoryExists($targetDir);

                    $zip = new \ZipArchive;
                    if ($zip->open($this->zipFilePath) === true) {
                        if ($zip->locateName($this->fileMap[$key]) !== false) {
                            copy("zip://{$this->zipFilePath}#{$this->fileMap[$key]}", "{$targetDir}/{$newFileName}");
                            $moved[$dbKey] = $newFileName;
                        }
                        $zip->close();
                    }

                    break;
                }
            }
        }

        return $moved;
    }




    protected function normalizeRow($row)
    {
        $normalized = [];
        $map = [
            'uuid' => Str::uuid(),
            'student_name' => ['student_name', 'name'],
            'student_email_id' => ['student_email_id', 'email'],
            'class' => ['class'],
            'section' => ['section'],
            'house' => ['house'],
            'father_name' => ['father_name'],
            'father_contact_no' => ['father_contact_no', 'father_phone'],
            'mother_name' => ['mother_name'],
            'mother_contact_no' => ['mother_contact_no'],
            'guardian_name' => ['guardian_name'],
            'guardian_contact_no' => ['guardian_contact_no'],
            'gurdian_relation' => ['gurdian_relation'],
            'student_photo' => ['student_photo'],
            'student_signature' => ['student_signature'],
            'father_photo' => ['father_photo'],
            'father_signature' => ['father_signature'],
            'mother_photo' => ['mother_photo'],
            'mother_signature' => ['mother_signature'],
            'guardian_photo' => ['guardian_photo'],
            'guardian_signature' => ['guardian_signature'],
            'uid_no' => ['uid_no'],
            'sr_no' => ['sr_no'],
            'pan_no' => ['pan_no'],
            'date_of_birth' => ['date_of_birth', 'dob'],
            'gender' => ['gender'],
            'blood_group' => ['blood_group'],
            'transport_mode' => ['transport_mode'],
            'reg_no' => ['reg_no'],
            'roll_no' => ['roll_no'],
            'aadhar_no' => ['aadhar_no'],
            'admission_no' => ['admission_no'],
            'rfid_card_no' => ['rfid_card_no'],
            'student_address' => ['student_address'],
            'pincode' => ['pincode'],
            'student_contact_no' => ['student_contact_no'],
            'student_whatsapp_no' => ['student_whatsapp_no'],
            'mother_whatsapp_contact_no' => ['mother_whatsapp_contact_no'],
            'student_nic_id'        => ['student_nic_id'],
            'caste'                 => ['caste'],
            'is_rte_student'        => ['is_rte_student'],
            'religion'              => ['religion'],
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
        $map = [
            'student_photo',
            'student_signature',
            'father_photo',
            'father_signature',
            'mother_photo',
            'mother_signature',
            'guardian_photo',
            'guardian_signature',
        ];

        foreach ($rows as $row) {
            foreach ($map as $key) {
                $value = $row[$key] ?? null;
                if ($value) {
                    $baseName = strtolower(pathinfo($value, PATHINFO_FILENAME));
                    $required[] = $baseName;
                    foreach (['jpg', 'jpeg', 'png'] as $ext) {
                        $required[] = "{$baseName}.{$ext}";
                    }
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
