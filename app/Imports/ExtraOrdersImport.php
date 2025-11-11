<?php

namespace App\Imports;

use App\Helpers;
use App\Models\ExtraOrder;
use App\Models\ImportProcess;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ExtraOrdersImport implements ToCollection, WithHeadingRow
{
    protected $admin;
    protected $guard;
    protected $fileMap;
    protected $photoDir;
    protected $progress;
    protected $zipFilePath;

    public function __construct($admin, $guard, $fileMap = [], $zipFilePath = null)
    {
        $this->admin       = $admin;
        $this->guard       = $guard;
        $this->fileMap     = $fileMap ?? [];
        $this->zipFilePath = $zipFilePath;

        $this->photoDir  = storage_path("app/public/extra_orders_photos");

        File::ensureDirectoryExists($this->photoDir);

        $this->progress = ImportProcess::firstOrCreate(
            ['auth_id' => $this->admin->id, 'type' => 'extra_orders'],
            ['total' => 0, 'success' => 0, 'failed' => 0, 'failed_rows' => []]
        );
    }

    public function collection(Collection $rows)
    {
        $this->progress->refresh();
        $this->progress->total += $rows->count();
        $this->progress->save();

        foreach ($rows->chunk(20) as $batch) {
            DB::transaction(function () use ($batch) {
                foreach ($batch as $row) {
                    $this->processRow($row);
                }
            });
        }
    }

    protected function processRow($row)
    {
        $data = $this->normalizeRow($row);

        try {
            if (empty($data['order_type'])) {
                throw new \Exception('Missing Order Type');
            }

            // Move photos from ZIP if present
            if (!empty($data['photo'])) {
                $movedPhotos = $this->preparePhotosForRow($data);
                foreach ($data['data'] as &$item) {
                    if (strtolower($item['name']) === 'photo' && isset($movedPhotos['photo'])) {
                        $item['value'] = $movedPhotos['photo'];
                    }
                }
            }

            ExtraOrder::create([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'type' => $data['order_type'],
                'data' => $data['data'],
            ]);

            $this->progress->success++;
            $this->progress->save();

        } catch (\Throwable $e) {
            Log::error("Excel import failed: ".$e->getMessage());
            $this->progress->failed++;
            $failed = $this->progress->failed_rows ?? [];
            $failed[] = [
                'order_type' => $data['order_type'] ?? '',
                'error'      => $e->getMessage(),
            ];
            $this->progress->failed_rows = $failed;
            $this->progress->save();
        }
    }



    protected function preparePhotosForRow(array $data): array
    {
        $moved = [];
        if (!$this->zipFilePath || !file_exists($this->zipFilePath)) {
            return $moved;
        }

        $zip = new \ZipArchive;
        if ($zip->open($this->zipFilePath) !== true) {
            Log::error("Unable to open ZIP: {$this->zipFilePath}");
            return $moved;
        }

        $photo = strtolower(trim($data['photo'] ?? ''));
        if ($photo) {
            $idx = $zip->locateName($photo);
            if ($idx !== false) {
                $ext     = pathinfo($photo, PATHINFO_EXTENSION);
                $newFile = pathinfo($photo, PATHINFO_FILENAME) . '-' . \App\Helpers::shortUuid() . '.' . $ext;
                $full    = "{$this->photoDir}/{$newFile}";
                File::ensureDirectoryExists($this->photoDir);
                copy("zip://{$this->zipFilePath}#{$photo}", $full);
                $moved['photo'] = $newFile;
            } else {
                Log::warning("File {$photo} not found in ZIP.");
            }
        }

        $zip->close();
        return $moved;
    }


    protected function normalizeRow($row): array
    {
        $rowArray  = is_array($row) ? $row : $row->toArray();
        $orderType = $rowArray['order_type'] ?? $rowArray['Order Type'] ?? null;

        $dataItems = [];

        foreach ($rowArray as $key => $value) {
            if (strtolower($key) === 'order_type') {
                continue;
            }

            if ($value === null || $value === '') {
                continue;
            }

            // Always include photo in data as well
            if (strtolower($key) === 'photo') {
                $dataItems[] = [
                    'name'  => 'photo',
                    'value' => strtolower(trim($value)), // normalize filename
                ];
                continue;
            }

            $dataItems[] = [
                'name'  => trim($key),
                'value' => trim((string) $value),
            ];
        }

        return [
            'order_type' => $orderType,
            'data'       => $dataItems,                  // Photo now included here as well
            'photo'      => $rowArray['photo'] ?? null,  // Keep for separate handling if needed
        ];
    }



    public function chunkSize(): int
    {
        return 100;
    }
}
