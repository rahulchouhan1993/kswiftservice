<?php

namespace App\Jobs;

use App\Helpers;
use App\Imports\StaffImport;
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

class ImportStaff implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $admin;
    protected $guard;
    protected $school;
    protected $schoolSession;
    protected $dataFilePath;
    protected $zipFilePath;

    protected $staffPhotoDir;
    public function __construct($admin, $guard, $school, $schoolSession, $dataFilePath, $zipFilePath = null)
    {
        $this->admin         = $admin;
        $this->guard         = $guard;
        $this->school        = $school;
        $this->schoolSession = $schoolSession;
        $this->dataFilePath  = $dataFilePath;
        $this->zipFilePath   = $zipFilePath;

        $prefix = $this->school->folder_prefix ?? ($this->school->school_prefix ?? 'school');
        $this->staffPhotoDir   = storage_path("app/public/{$prefix}_staff_photo");
        File::ensureDirectoryExists($this->staffPhotoDir);
    }

    public function handle()
    {
        $progress = ImportProcess::updateOrCreate(
            [
                'auth_id'   => $this->admin->id,
                'school_id' => $this->school->id,
                'type'      => 'staff',
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
            $rows = Excel::toCollection(
                new StaffImport(
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
                new StaffImport(
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
            'photo',
        ];

        foreach ($rows as $row) {
            foreach ($photoColumns as $col) {
                if (!empty($row[$col])) {
                    $baseName = strtolower(pathinfo($row[$col], PATHINFO_FILENAME));
                    $required[] = $baseName;
                    foreach (['jpg', 'jpeg', 'png'] as $ext) {
                        $required[] = "{$baseName}.{$ext}";
                    }
                }
            }
        }

        return array_unique($required);
    }
}
