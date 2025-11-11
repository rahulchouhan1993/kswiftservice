<?php

namespace App\Jobs;

use App\Helpers;
use App\Imports\StudentsImport;
use App\Models\ImportProcess;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ImportStudents implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $admin;
    protected $guard;
    protected $school;
    protected $schoolSession;
    protected $dataFilePath;
    protected $zipFilePath;

    protected $studentPhotoDir;
    protected $studentSignDir;
    protected $parentPhotoDir;
    protected $parentSignDir;
    protected $guardianPhotoDir;
    protected $guardianSignDir;

    public function __construct($admin, $guard, $school, $schoolSession, $dataFilePath, $zipFilePath = null)
    {
        $this->admin         = $admin;
        $this->guard         = $guard;
        $this->school        = $school;
        $this->schoolSession = $schoolSession;
        $this->dataFilePath  = $dataFilePath;
        $this->zipFilePath   = $zipFilePath;

        $prefix = $this->school->folder_prefix ?? ($this->school->school_prefix ?? 'school');

        $this->studentPhotoDir   = storage_path("app/public/{$prefix}_students_photo");
        $this->studentSignDir    = storage_path("app/public/{$prefix}_students_sign");
        $this->parentPhotoDir    = storage_path("app/public/{$prefix}_parent_photos");
        $this->parentSignDir     = storage_path("app/public/{$prefix}_parent_signs");
        $this->guardianPhotoDir  = storage_path("app/public/{$prefix}_guardian_photo");
        $this->guardianSignDir   = storage_path("app/public/{$prefix}_guardian_sign");

        // Make sure directories exist
        File::ensureDirectoryExists($this->studentPhotoDir);
        File::ensureDirectoryExists($this->studentSignDir);
        File::ensureDirectoryExists($this->parentPhotoDir);
        File::ensureDirectoryExists($this->parentSignDir);
        File::ensureDirectoryExists($this->guardianPhotoDir);
        File::ensureDirectoryExists($this->guardianSignDir);
    }

    public function handle()
    {
        $progress = ImportProcess::updateOrCreate(
            [
                'auth_id'   => $this->admin->id,
                'school_id' => $this->school->id,
                'type'      => 'students',
            ],
            [
                'total'       => 0,
                'success'     => 0,
                'failed'      => 0,
                'failed_rows' => [],
            ]
        );
        $progress->touch();

        try {
            // 1. Load Excel into collection just to find required photo names
            $rows = Excel::toCollection(
                new StudentsImport(
                    $this->admin,
                    $this->guard,
                    $this->school,
                    $this->schoolSession,
                    $progress->id
                ),
                $this->dataFilePath,
                null,
                $this->getReaderType($this->dataFilePath)
            )->first();

            $requiredFiles = $this->collectRequiredFiles($rows);

            $fileMap = $this->prepareFileMap($requiredFiles);

            Excel::import(
                new StudentsImport(
                    $this->admin,
                    $this->guard,
                    $this->school,
                    $this->schoolSession,
                    $progress->id,
                    $fileMap,
                    $this->zipFilePath
                ),
                $this->dataFilePath,
                null,
                $this->getReaderType($this->dataFilePath)
            );


        } catch (\Throwable $e) {
            Log::error("Excel import failed for school {$this->school->id}: " . $e->getMessage(), [
                'file' => $this->dataFilePath,
                'line' => $e->getLine(),
            ]);
        }

        $this->cleanupFiles();
    }

    protected function getReaderType($filePath)
    {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        return match ($ext) {
            'xlsx' => \Maatwebsite\Excel\Excel::XLSX,
            'xls'  => \Maatwebsite\Excel\Excel::XLS,
            'csv'  => \Maatwebsite\Excel\Excel::CSV,
            default => \Maatwebsite\Excel\Excel::XLSX,
        };
    }

    protected function cleanupFiles()
    {
        foreach ([$this->dataFilePath, $this->zipFilePath] as $file) {
            if ($file && file_exists($file)) {
                @File::delete($file);
            }
        }
    }

    /**
     * Extract only required files from ZIP
     */
    protected function prepareFileMap(array $requiredFiles = []): array
    {
        if (!$this->zipFilePath) return [];

        $map = [];
        $zip = new \ZipArchive;

        if ($zip->open($this->zipFilePath) === true) {
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $entryName = $zip->getNameIndex($i);
                if (substr($entryName, -1) === '/') continue;

                $fileName = strtolower(pathinfo($entryName, PATHINFO_BASENAME));

                if (!empty($requiredFiles) && !in_array($fileName, $requiredFiles)) {
                    continue;
                }

                // store entry reference, not copy
                $map[$fileName] = $entryName;
            }
            $zip->close();
        }

        return $map;
    }


    /**
     * Collect all photo filenames from Excel rows
     */
    protected function collectRequiredFiles($rows): array
    {
        $required = [];
        $photoColumns = [
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
            foreach ($photoColumns as $col) {
                if (!empty($row[$col])) {
                    $baseName = strtolower(pathinfo($row[$col], PATHINFO_FILENAME));
                    $required[] = $baseName;
                    foreach (['jpg','jpeg','png'] as $ext) {
                        $required[] = "{$baseName}.{$ext}";
                    }
                }
            }
        }

        return array_unique($required);
    }
}
