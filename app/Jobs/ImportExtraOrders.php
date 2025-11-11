<?php

namespace App\Jobs;

use App\Imports\ExtraOrdersImport;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;


class ImportExtraOrders implements ShouldQueue
{
    use Queueable;

    protected $admin;
    protected $guard;
    protected $dataFilePath;
    protected $zipFilePath;

    protected $photoDir;

    public function __construct($admin, $guard, $dataFilePath, $zipFilePath = null)
    {
        $this->admin         = $admin;
        $this->guard         = $guard;
        $this->dataFilePath  = $dataFilePath;
        $this->zipFilePath   = $zipFilePath;

        $this->photoDir  = storage_path("app/public/extra_orders_photos");
        File::ensureDirectoryExists($this->photoDir);
    }


    public function handle()
    {
        try {
            $rows = Excel::toCollection(
                new ExtraOrdersImport(
                    $this->admin,
                    $this->guard
                ),
                $this->dataFilePath,
                null,
                $this->getReaderType($this->dataFilePath)
            )->first();

            $requiredFiles = $this->collectRequiredFiles($rows);
            $fileMap = $this->prepareFileMap($requiredFiles);

            Excel::import(
                new ExtraOrdersImport(
                    $this->admin,
                    $this->guard,
                    $fileMap,
                    $this->zipFilePath
                ),
                $this->dataFilePath,
                null,
                $this->getReaderType($this->dataFilePath)
            );


        } catch (\Throwable $e) {
            Log::error("Excel import failed for products" . $e->getMessage(), [
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
            $rowArray = is_array($row) ? $row : $row->toArray();
            foreach ($photoColumns as $col) {
                if (!empty($rowArray[$col] ?? null)) {
                    $baseName = strtolower(pathinfo($rowArray[$col], PATHINFO_FILENAME));
                    $required[] = $baseName;
                    foreach (['jpg','jpeg','png','webp'] as $ext) {
                        $required[] = "{$baseName}.{$ext}";
                    }
                }
            }
        }
        return array_unique($required);
    }


}
