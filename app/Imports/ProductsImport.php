<?php

namespace App\Imports;

use App\Helpers;
use App\Models\Category;
use App\Models\ImportProcess;
use App\Models\Product;
use App\Models\ProductTag;
use App\Models\SubCategory;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\{DB, File, Log};
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Exception;

use function App\calculateProductDiscount;

class ProductsImport implements ToCollection, WithHeadingRow, WithChunkReading
{
    protected $admin;
    protected $guard;
    protected $fileMap;
    protected $thumbnailPhotoDir;
    protected $productVideoDir;
    protected $product360VideoDir;
    protected $productPdfDir;
    protected $progress;
    protected $zipFilePath;

    public function __construct($admin, $guard, $fileMap = [], $zipFilePath = null)
    {
        $this->admin       = $admin;
        $this->guard       = $guard;
        $this->fileMap     = $fileMap ?? [];
        $this->zipFilePath = $zipFilePath;

        $this->thumbnailPhotoDir  = storage_path("app/public/thumbnail_photo");
        $this->productVideoDir    = storage_path("app/public/product_video");
        $this->product360VideoDir = storage_path("app/public/product_360video");
        $this->productPdfDir      = storage_path("app/public/product_pdf");

        File::ensureDirectoryExists($this->thumbnailPhotoDir);
        File::ensureDirectoryExists($this->productVideoDir);
        File::ensureDirectoryExists($this->product360VideoDir);
        File::ensureDirectoryExists($this->productPdfDir);

        $this->progress = ImportProcess::firstOrCreate(
            ['auth_id' => $this->admin->id, 'type' => 'products'],
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
            if (empty($data['product_name'])) {
                throw new Exception('Missing Product Name');
            }

            // Parse names from Excel
            $categoryNames    = !empty($data['categories']) ? array_map('trim', explode(',', $data['categories'])) : [];
            $subcategoryNames = !empty($data['sub_categories']) ? array_map('trim', explode(',', $data['sub_categories'])) : [];

            // 1️⃣ Match categories by name
            $categories = Category::whereIn('name', $categoryNames)->pluck('id', 'name')->toArray();
            $categoryIds = array_values($categories);

            // 2️⃣ Match subcategories only related to the matched categories
            $subcategoriesQuery = SubCategory::whereIn('name', $subcategoryNames);

            if (!empty($categoryIds)) {
                $subcategoriesQuery->whereIn('category_id', $categoryIds);
            }

            $subcategories = $subcategoriesQuery->pluck('id', 'name')->toArray();
            $subcategoryIds = array_values($subcategories);

            // 3️⃣ Find unmatched names for logging
            $unmatchedCategories = array_diff($categoryNames, array_keys($categories));
            $unmatchedSubcats    = array_diff($subcategoryNames, array_keys($subcategories));

            if (!empty($unmatchedCategories)) {
                Log::warning('Unmatched categories: '.implode(', ', $unmatchedCategories));
            }

            if (!empty($unmatchedSubcats)) {
                Log::warning('Unmatched subcategories (not in selected categories): '.implode(', ', $unmatchedSubcats));
            }



            $tags = !empty($data['tags']) ? array_map('trim', explode(',', $data['tags'])) : [];
            foreach ($tags as $tag) {
                ProductTag::firstOrCreate(['name' => $tag]);
            }

            $price         = $data['price'] !== null ? (float)$data['price'] : null;
            $customerPrice = $data['customer_price'] !== null ? (float)$data['customer_price'] : null;
            $dealerPrice   = $data['dealer_price'] !== null ? (float)$data['dealer_price'] : null;

            $customerDiscount = $price && $customerPrice ? calculateProductDiscount($price, $customerPrice) : 0;
            $dealerDiscount   = $price && $dealerPrice ? calculateProductDiscount($price, $dealerPrice) : 0;

            $skuCode = $data['sku_code'] ?: 'AB'.rand(10000, 99999);

            $moved = $this->preparePhotosForRow($data);

            $product = Product::create([
                'uuid'             => Str::uuid(),
                'category_ids'     => $categoryIds,
                'subcategory_ids'  => $subcategoryIds,
                'user_id'          => $this->admin->id,
                'name'             => $data['product_name'],
                'slug'             => Str::slug($data['product_name']),
                'price'            => $price,
                'customer_price'   => $customerPrice,
                'dealer_price'     => $dealerPrice,
                'customer_discount'=> $customerDiscount,
                'dealer_discount'  => $dealerDiscount,
                'product_type'     => $data['product_type'] === 'raw' ? 0 : 1,
                'tags'             => $tags,
                'gst'              => $data['gst'] ?? null,
                'sku_code'         => $skuCode,
                'hsn_code'         => $data['hsn_code'] ?? null,
                'quantity'         => $data['quantity'] ?? null,
                'low_stock_alert'  => $data['low_stock_alert'] ?? null,
                'description'      => $data['product_description'] ?? null,
                'extra_details'    => [$data['extra_details']] ?? null,
                'thumbnail_photo'  => $moved['thumbnail_photo'] ?? null,
                'product_video'    => $moved['product_video'] ?? null,
                'product_360video' => $moved['product_360_video'] ?? null,
                'product_pdf'      => $moved['product_pdf'] ?? null,
                'is_returnable'    => $data['is_returnable'] === 'yes' ? 1 : 0,
                'stock_status'     => $data['stock_status'] === 'in_stock' ? 1 : 0,
                'is_customized'    => $data['is_customized'] === 'yes' ? 1 : 0,
                'is_downloadable'  => $data['is_downloadable'] === 'yes' ? 1 : 0,
                'in_today_deals'   => $data['in_today_deals'] === 'yes' ? 1 : 0,
                'in_featured_products' => $data['in_featured_products'] === 'yes' ? 1 : 0,
                'in_special_offers'=> $data['in_special_offers'] === 'yes' ? 1 : 0,
                'in_weekly_offer'  => $data['in_weekly_offer'] === 'yes' ? 1 : 0,
                'in_special_deals' => $data['in_special_deals'] === 'yes' ? 1 : 0,
                'in_treanding_products'=> $data['in_treanding_products'] === 'yes' ? 1 : 0,
                'measurement_unit' => $data['measurement_unit'] ?? null,
            ]);

            if ($data['is_returnable'] === 'yes') {
                DB::table('product_return_policies')->insert([
                    'uuid'        => Str::uuid(),
                    'product_id'  => $product->id,
                    'days'        => $data['return_days'] ?? 0,
                    'description' => $data['return_policy'] ?? '',
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }

            if (!empty($data['seo_title']) || !empty($data['seo_keywords']) || !empty($data['seo_description'])) {
                DB::table('product_seo_details')->insert([
                    'uuid'        => Str::uuid(),
                    'product_id'  => $product->id,
                    'title'       => $data['seo_title'] ?? '',
                    'keywords'    => $data['seo_keywords'] ?? '',
                    'description' => $data['seo_description'] ?? '',
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }

            if (!empty($data['product_images'])) {
                $images = array_map('trim', explode(',', $data['product_images']));
                $zip = new \ZipArchive;
                if ($zip->open($this->zipFilePath) === true) {
                    foreach ($images as $img) {
                        $idx = $zip->locateName($img);
                        if ($idx !== false) {
                            $ext     = pathinfo($img, PATHINFO_EXTENSION);
                            $newName = pathinfo($img, PATHINFO_FILENAME) . '-' . Helpers::shortUuid() . '.' . $ext;
                            $path    = storage_path("app/public/product_images/{$newName}");
                            File::ensureDirectoryExists(storage_path("app/public/product_images"));
                            copy("zip://{$this->zipFilePath}#{$img}", $path);

                            DB::table('product_images')->insert([
                                'uuid'       => Str::uuid(),
                                'product_id' => $product->id,
                                'photo_name' => $newName,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                    $zip->close();
                }
            }

            $this->progress->success++;
            $this->progress->save();

        } catch (Exception $e) {
            Log::error("Excel import failed: ".$e->getMessage());
            $this->progress->failed++;
            $failed = $this->progress->failed_rows ?? [];
            $failed[] = [
                'product_name' => $data['product_name'] ?? '',
                'error'        => $e->getMessage(),
            ];
            $this->progress->failed_rows = $failed;
            $this->progress->save();
        }
    }

    protected function preparePhotosForRow(array $data): array
    {
        $moved = [];
        $map = [
            'thumbnail_photo'   => $this->thumbnailPhotoDir,
            'product_video'     => $this->productVideoDir,
            'product_360_video' => $this->product360VideoDir,
            'product_pdf'       => $this->productPdfDir,
        ];

        $zip = new \ZipArchive;
        if ($zip->open($this->zipFilePath) !== true) {
            Log::error("Unable to open ZIP: {$this->zipFilePath}");
            return $moved;
        }

        foreach ($map as $excelKey => $targetDir) {
            $value = $data[$excelKey] ?? null;
            if (!$value) continue;

            $value = strtolower(trim($value));
            $idx = $zip->locateName($value);

            if ($idx !== false) {
                $ext     = pathinfo($value, PATHINFO_EXTENSION);
                $newFile = pathinfo($value, PATHINFO_FILENAME) . '-' . Helpers::shortUuid() . '.' . $ext;
                $full    = "{$targetDir}/{$newFile}";
                File::ensureDirectoryExists($targetDir);
                copy("zip://{$this->zipFilePath}#{$value}", $full);
                $moved[$excelKey] = $newFile;
            } else {
                Log::warning("File {$value} not found in ZIP.");
            }
        }

        $zip->close();
        return $moved;
    }

    protected function normalizeRow($row): array
    {
        $normalized = [];
        $map = [
            'product_name','categories','sub_categories','tags','price','customer_price',
            'dealer_price','product_type','gst','sku_code','hsn_code','measurement_unit',
            'quantity','low_stock_alert','product_description','extra_details',
            'thumbnail_photo','product_video','product_360_video','product_pdf','stock_status',
            'is_returnable','return_days','return_policy','is_customized','is_downloadable',
            'in_today_deals','in_featured_products','in_special_offers','in_weekly_offer',
            'in_special_deals','in_treanding_products','seo_title','seo_keywords',
            'seo_description','product_images'
        ];

        foreach ($map as $key) {
            $normalized[$key] = isset($row[$key]) && $row[$key] !== '' 
                ? (is_string($row[$key]) ? trim($row[$key]) : $row[$key]) 
                : null;
        }

        return $normalized;
    }

    public function chunkSize(): int
    {
        return 100;
    }
}
