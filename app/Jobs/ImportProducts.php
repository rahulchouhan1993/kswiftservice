<?php

namespace App\Jobs;

use App\Helpers;
use App\Imports\ProductsImport;
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

class ImportProducts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $admin;
    protected $guard;
    protected $dataFilePath;
    protected $zipFilePath;

    protected $thumbnailPhotoDir;
    protected $productVideoDir;
    protected $product360VideoDir;
    protected $productPdfDir;

    public function __construct($admin, $guard, $dataFilePath, $zipFilePath = null)
    {
        $this->admin         = $admin;
        $this->guard         = $guard;
        $this->dataFilePath  = $dataFilePath;
        $this->zipFilePath   = $zipFilePath;

        $this->thumbnailPhotoDir   = storage_path("app/public/thumbnail_photo");
        $this->productVideoDir    = storage_path("app/public/product_video");
        $this->product360VideoDir     = storage_path("app/public/product_360video");
        $this->productPdfDir  = storage_path("app/public/product_pdf");

        // Make sure directories exist
        File::ensureDirectoryExists($this->thumbnailPhotoDir);
        File::ensureDirectoryExists($this->productVideoDir);
        File::ensureDirectoryExists($this->product360VideoDir);
        File::ensureDirectoryExists($this->productPdfDir);
    }

    public function handle()
    {
        try {
            $rows = Excel::toCollection(
                new ProductsImport(
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
                new ProductsImport(
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
            'thumbnail_photo',
            'product_video',
            'product_360_video',
            'product_pdf',
        ];

        foreach ($rows as $row) {
            foreach ($photoColumns as $col) {
                if (!empty($row[$col])) {
                    $baseName = strtolower(pathinfo($row[$col], PATHINFO_FILENAME));
                    $required[] = $baseName;
                    foreach (['jpg','jpeg','png', 'webp'] as $ext) {
                        $required[] = "{$baseName}.{$ext}";
                    }
                }
            }
        }

        return array_unique($required);
    }
}
