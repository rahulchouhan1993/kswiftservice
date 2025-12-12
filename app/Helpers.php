<?php

namespace App;

use App\Models\ActivityLog;
use App\Models\Role;
use App\Models\SchoolRolePermission;
use App\Models\SystemSetting;
use App\Models\WhatsappMsgHistory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use ZipArchive;

class Helpers
{
    public static function formateDate($date)
    {
        return Carbon::parse($date)->format('d M Y \- g:i A');
    }

    public static function formateDate2($date)
    {
        return Carbon::parse($date)->format('d M - Y');
    }

    public static function shortDate($date)
    {
        return Carbon::parse($date)->format('j M');
    }

    public static function getFileExtension($fileName)
    {
        return !empty($fileName) ? pathinfo($fileName, PATHINFO_EXTENSION) : null;
    }

    /**
     * Short UUID
     * @return mixed
     */
    public static function shortUuid()
    {
        $shortUuid = Str::uuid()->toString();
        $shortUuid = substr($shortUuid, 0, 8);
        return $shortUuid;
    }


    /**
     * Short String
     * @param string $string
     * @param integer $charecters
     * @return mixed
     */
    function shortString($string, $charecters)
    {
        return substr($string, 0, $charecters);
    }

    /**
     * Convert to number format
     *
     * @param mixed $num
     * @param int $place
     * @return float|string
     */
    public static function numFormat($num, $place = 2)
    {
        return number_format($num, $place, '.');
    }

    /**
     * Format number as Rupee currency
     *
     * @param mixed $num
     * @param int $place
     * @return string
     */
    public static function toRupeeCurrency($num, $place = 2)
    {
        if (is_int($num) || is_numeric($num)) {
            return " ₹ " . self::numFormat($num, $place);
        } else {
            return 'NA';
        }
    }

    /**
     * Clean and format name to Camel Case
     *
     * @param string $name
     * @return string
     */
    public static function cleanName(string $name): string
    {
        return ucwords(strtolower(preg_replace('/\s+/', ' ', trim($name))));
    }

    /**
     * Generate a secure random password
     *
     * @param int $length
     * @param bool $includeUppercase
     * @param bool $includeNumbers
     * @param bool $includeSpecialChars
     * @return string
     */
    public static function passwordGenerate(
        int $length = 16,
        bool $includeUppercase = true,
        bool $includeNumbers = true,
        bool $includeSpecialChars = true
    ): string {
        $characters = 'abcdefghijklmnopqrstuvwxyz';
        if ($includeUppercase) $characters .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if ($includeNumbers) $characters .= '0123456789';
        if ($includeSpecialChars) $characters .= '!@#%&()_+=-~|;\':",/?';

        $password = '';
        for ($i = 0; $i < $length; $i++) {
            $password .= $characters[random_int(0, strlen($characters) - 1)];
        }

        return $password;
    }
}

if (!function_exists('hasPermissionLike')) {
    /**
     * Check if user has any permission starting with the given prefix
     *
     * @param string $prefix
     * @return bool
     */
    function hasPermissionLike(string $prefix): bool
    {
        $user = auth()->user();
        if (!$user) return false;

        $permissions = $user->getAllPermissions()->pluck('name');
        return $permissions->contains(fn($permission) => Str::startsWith($permission, $prefix));
    }
}

if (!function_exists('isServiceActive')) {
    /**
     * Check if a named service is active via system settings
     *
     * @param string $name
     * @return array
     */
    function isServiceActive(string $name): array
    {
        $setting = SystemSetting::whereName($name)->first();

        if ($setting && $setting->value == 1) {
            return [
                'status' => true,
                'message' => $setting->extra['message'] ?? 'Service active.'
            ];
        } elseif ($setting && $setting->value == 0) {
            return [
                'status' => false,
                'message' => $setting->extra['message'] ?? 'Service inactive, please contact to administrator.'
            ];
        } else {
            return [
                'status' => false,
                'message' => "Service not configured, contact administrator."
            ];
        }
    }
}


/**
 * Upload and optionally replace an existing file for a model.
 *
 * @param Request $request
 * @param string $requestField
 * @param mixed $model
 * @param string $folder
 * @param string|null $modelField
 * @param string|null $folderPrefix // Folder Name Prefix Where (School Name) For Create School FOlder Seperate Folders
 * @param string|null $fileName // File Name
 */
function uploadRequestFile(Request $request, string $requestField, $model, string $folder, ?string $modelField = null, $folderPrefix = null, $fileName = null)
{
    if ($request->hasFile($requestField)) {

        $modelField = $modelField ?? $requestField;

        if (!empty($folderPrefix)) {
            $folder = $folderPrefix . '_' . $folder;
        }

        $oldFile = $model->{$modelField};
        if ($oldFile && Storage::disk('public')->exists("{$folder}/{$oldFile}")) {
            Storage::disk('public')->delete("{$folder}/{$oldFile}");
        }

        $file = $request->file($requestField);
        $extension = strtolower($file->getClientOriginalExtension());
        if (!$fileName) {
            $fileName = Helpers::shortUuid() . '.' . $extension;
        }

        Storage::disk('public')->put("{$folder}/{$fileName}", file_get_contents($file));

        $model->{$modelField} = $fileName;
        $model->save();

        return $fileName; // ← IMPORTANT RETURN
    }

    return null;
}



if (!function_exists('getClassNameByPrefixType')) {
    /**
     * Convert class number to formatted name by prefix type.
     *
     * @param mixed $classNumber
     * @param string $prefixType
     * @return string|null
     */
    function getClassNameByPrefixType($classNumber, $prefixType = 'normal')
    {
        if (empty($classNumber) || !is_numeric($classNumber)) {
            return $classNumber;
        }

        $num = intval($classNumber);

        // Roman numeral conversion
        $toRoman = function ($n) {
            $romanMap = [
                ['M', 1000],
                ['CM', 900],
                ['D', 500],
                ['CD', 400],
                ['C', 100],
                ['XC', 90],
                ['L', 50],
                ['XL', 40],
                ['X', 10],
                ['IX', 9],
                ['V', 5],
                ['IV', 4],
                ['I', 1],
            ];
            $result = '';
            foreach ($romanMap as [$letter, $value]) {
                while ($n >= $value) {
                    $result .= $letter;
                    $n -= $value;
                }
            }
            return $result;
        };

        // Alphabetic word conversion
        $toAlphabetWord = function ($n) {
            $words = [
                "First",
                "Second",
                "Third",
                "Fourth",
                "Fifth",
                "Sixth",
                "Seventh",
                "Eighth",
                "Ninth",
                "Tenth",
                "Eleventh",
                "Twelfth",
                "Thirteenth",
                "Fourteenth",
                "Fifteenth",
                "Sixteenth",
                "Seventeenth",
                "Eighteenth",
                "Nineteenth",
                "Twentieth",
                "Twenty-First",
                "Twenty-Second",
                "Twenty-Third",
                "Twenty-Fourth",
                "Twenty-Fifth",
                "Twenty-Sixth",
                "Twenty-Seventh",
                "Twenty-Eighth",
                "Twenty-Ninth",
                "Thirtieth",
            ];
            return $words[$n - 1] ?? "Class " . $n;
        };

        // Alphanumeric (1st, 2nd, 3rd)
        $toAlphaNum = function ($n) {
            $v = $n % 100;
            if ($v >= 11 && $v <= 13) {
                $suffix = 'th';
            } else {
                switch ($n % 10) {
                    case 1:
                        $suffix = 'st';
                        break;
                    case 2:
                        $suffix = 'nd';
                        break;
                    case 3:
                        $suffix = 'rd';
                        break;
                    default:
                        $suffix = 'th';
                }
            }
            return $n . $suffix;
        };

        switch (strtolower($prefixType)) {
            case 'roman':
                return $toRoman($num);
            case 'alphabet':
                return $toAlphabetWord($num);
            case 'alpha numeric':
                return $toAlphaNum($num);
            case 'normal':
            default:
                return (string)$num;
        }
    }
}

function getCurrentGuardAndUser(array $guards = ['superadmin', 'partner', 'school', 'staff', 'web'])
{
    foreach ($guards as $guard) {
        if (Auth::guard($guard)->check()) {
            return [
                'guard' => $guard,
                'user' => Auth::guard($guard)->user(),
            ];
        }
    }

    return [
        'guard' => null,
        'user' => null,
    ];
}


if (!function_exists('shortSession')) {
    function shortSession($session)
    {
        if (!$session || !str_contains($session, '-')) return '--';

        [$start, $end] = explode('-', $session);

        return substr($start, -2) . '-' . substr($end, -2);
    }
}


function getFolderSizeInBytes($path)
{
    $size = 0;
    foreach (scandir($path) as $file) {
        if ($file === '.' || $file === '..') continue;
        $filePath = $path . DIRECTORY_SEPARATOR . $file;
        $size += is_dir($filePath)
            ? getFolderSizeInBytes($filePath)
            : filesize($filePath);
    }
    return $size;
}

function formatBytes($bytes, $precision = 2)
{
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $bytes = max($bytes, 0);
    $pow = $bytes > 0 ? floor(log($bytes, 1024)) : 0;
    $pow = min($pow, count($units) - 1);
    return round($bytes / (1024 ** $pow), $precision) . ' ' . $units[$pow];
}


/**
 * Download the content of a folder inside storage/app/public as a zip.
 *
 * @param string $folder
 * @param string $type
 * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|string
 */

function downloadFolderAsZip($folder, $type = 'all')
{
    $sourcePath = storage_path("app/public/{$folder}");
    if (!is_dir($sourcePath)) {
        return 'Folder not found.';
    }

    $zipFileName = $folder . '.zip';
    $zipFilePath = storage_path("app/temp/{$zipFileName}");

    if (!file_exists(storage_path('app/temp'))) {
        mkdir(storage_path('app/temp'), 0777, true);
    }

    $zip = new ZipArchive;
    if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($sourcePath),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $file) {
            if (!$file->isDir()) {
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($sourcePath) + 1);

                // Only include camera images if type is 'camera'
                if ($type === 'camera') {
                    // Skip files containing a dash '-'
                    if (str_contains($file->getFilename(), '-')) {
                        continue;
                    }
                }

                $zip->addFile($filePath, $relativePath);
            }
        }

        $zip->close();
        return Response::download($zipFilePath)->deleteFileAfterSend(true);
    } else {
        return 'Could not create ZIP file.';
    }
}

/**
 * Split Image (Break Image - Create 2 Images from a Single Image)
 *
 * @param \Illuminate\Http\UploadedFile $image The uploaded image file
 * @param string $splitMethod 'height' or 'width' based splitting
 * @param int $marginLeft Margin to remove from left side
 * @param int $marginRight Margin to remove from right side
 * @param int $marginTop Margin to remove from top side
 * @param int $marginBottom Margin to remove from bottom side
 * @param string $folder Folder name to save the split images in 'public' disk
 * @return array Returns asset URLs of original, part1, and part2 images or an error
 */
function ImageSplitAndSave(
    $image,
    string $splitMethod = 'height',
    int $marginLeft = 0,
    int $marginRight = 0,
    int $marginTop = 0,
    int $marginBottom = 0,
    string $folder = 'split_images'
): array {
    // Validate extension
    $extension = strtolower($image->getClientOriginalExtension());
    if (!in_array($extension, ['jpeg', 'jpg', 'png'])) {
        return ['error' => 'Unsupported image format'];
    }

    // Save original image
    $originalFilename = Str::uuid() . '.' . $extension;
    Storage::disk('public')->put("{$folder}/{$originalFilename}", file_get_contents($image));
    $absolutePath = storage_path("app/public/{$folder}/{$originalFilename}");

    // Load image
    $imageResource = match ($extension) {
        'jpeg', 'jpg' => @imagecreatefromjpeg($absolutePath),
        'png' => @imagecreatefrompng($absolutePath),
        default => null,
    };

    if (!$imageResource) {
        return ['error' => 'Unable to load image'];
    }

    $originalWidth = imagesx($imageResource);
    $originalHeight = imagesy($imageResource);

    // Validate margins
    if (($marginLeft + $marginRight) >= $originalWidth || ($marginTop + $marginBottom) >= $originalHeight) {
        return ['error' => 'Margins too large for image dimensions'];
    }

    // Crop all sides
    $croppedWidth = $originalWidth - $marginLeft - $marginRight;
    $croppedHeight = $originalHeight - $marginTop - $marginBottom;

    $croppedImage = imagecreatetruecolor($croppedWidth, $croppedHeight);
    imagecopy($croppedImage, $imageResource, 0, 0, $marginLeft, $marginTop, $croppedWidth, $croppedHeight);
    imagedestroy($imageResource);

    // Prepare save path
    $savePath = storage_path("app/public/{$folder}");
    if (!file_exists($savePath)) {
        mkdir($savePath, 0755, true);
    }

    // Split
    if ($splitMethod === 'height') {
        $half = (int)($croppedHeight / 2);
        $part1 = imagecreatetruecolor($croppedWidth, $half);
        $part2 = imagecreatetruecolor($croppedWidth, $croppedHeight - $half);

        imagecopy($part1, $croppedImage, 0, 0, 0, 0, $croppedWidth, $half);
        imagecopy($part2, $croppedImage, 0, 0, 0, $half, $croppedWidth, $croppedHeight - $half);
    } elseif ($splitMethod === 'width') {
        $half = (int)($croppedWidth / 2);
        $part1 = imagecreatetruecolor($half, $croppedHeight);
        $part2 = imagecreatetruecolor($croppedWidth - $half, $croppedHeight);

        imagecopy($part1, $croppedImage, 0, 0, 0, 0, $half, $croppedHeight);
        imagecopy($part2, $croppedImage, 0, 0, $half, 0, $croppedWidth - $half, $croppedHeight);
    } else {
        return ['error' => 'Invalid split method'];
    }

    // Filenames
    $timestamp = time();
    $part1Filename = "part1_{$timestamp}_" . Str::random(5) . ".{$extension}";
    $part2Filename = "part2_{$timestamp}_" . Str::random(5) . ".{$extension}";

    imagejpeg($part1, "{$savePath}/{$part1Filename}", 100);
    imagejpeg($part2, "{$savePath}/{$part2Filename}", 100);

    // Cleanup
    imagedestroy($croppedImage);
    imagedestroy($part1);
    imagedestroy($part2);

    return [
        'original' => asset("storage/{$folder}/{$originalFilename}"),
        'part1' => asset("storage/{$folder}/{$part1Filename}"),
        'part2' => asset("storage/{$folder}/{$part2Filename}"),
    ];
}



if (!function_exists('saveBase64Image')) {
    /**
     * Convert base64 to image file and return URL
     *
     * @param string $base64
     * @param string $folder
     * @return string
     */
    function saveBase64Image($base64, $folder = 'base64_images')
    {
        if (!preg_match("/data:image\/(.*?);base64,(.*)/", $base64, $matches)) {
            return null; // invalid base64
        }

        $extension = $matches[1];
        $data = $matches[2];
        $decoded = base64_decode($data);

        $filename = 'image_' . time() . '_' . Str::random(8) . '.' . $extension;
        $path = storage_path('app/public/' . $folder . '/' . $filename);

        // Make sure directory exists
        if (!file_exists(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        file_put_contents($path, $decoded);

        return asset('storage/' . $folder . '/' . $filename);
    }
}

if (!function_exists('calculateProductDiscount')) {
    function calculateProductDiscount($originalPrice, $currentPrice)
    {
        $op = floatval($originalPrice);
        $cp = floatval($currentPrice);

        if ($op <= 0 || $cp > $op) {
            return 0;
        }

        $discount = (($op - $cp) / $op) * 100;
        return number_format($discount, 2);
    }
}


if (!function_exists('activityLog')) {
    function activityLog($user, $title, $message, $link = null)
    {
        ActivityLog::create([
            'user_id' => $user->id,
            'title' => $title,
            'message' => $message,
            'link' => $link
        ]);
    }
}

/**
 * Generate message parameters dynamically based on the inputs.
 */
if (!function_exists('generateParameters')) {
    function generateParameters($data)
    {
        $parameters = [];
        foreach ($data as $d) {
            $parameters[] = ["type" => "text", "text" => $d];
        }
        return $parameters;
    }
}



/**
 * Save parameter Values In Array
 * @param array $perameter array
 * @return array
 */
if (!function_exists('perametersValues')) {
    function perametersValues($parameters)
    {
        $textValues = [];
        // Loop through the $parameters array
        foreach ($parameters as $parameter) {
            if (isset($parameter['text'])) {
                $textValues[] = $parameter['text'] ?? '--';
            }
        }
        return $textValues;
    }
}

/**
 * Create the message data for the API.
 */
if (!function_exists('createMessageData')) {
    function createMessageData($phone, $template, $lang, $parameters)
    {
        return [
            "messaging_product" => "whatsapp",
            "to" => '91' . $phone,
            "type" => "template",
            "template" => [
                "name" => $template,
                "language" => ["code" => $lang],
                "components" => [
                    [
                        "type" => "body",
                        "parameters" => $parameters
                    ]
                ]
            ]
        ];
    }
}


/**
 * Create Message History
 */
if (!function_exists('createMessageHistory')) {
    function createMessageHistory($templateName, $user, $phone, $resp)
    {
        $status = $resp['status'] ? 'Sent.' : 'Sending Failed.';
        WhatsappMsgHistory::create([
            'user_id' => $user ? $user->id : null,
            'template_name' => $templateName,
            'phone' => $phone,
            'status' => $status,
            'response' => $resp['result']
        ]);
    }
}




if (!function_exists('getNotificationTemplate')) {

    function getNotificationTemplate($event)
    {
        return [

            // 3. Booking Confirmed
            'booking_confirmed' => [
                'title' => 'Booking Confirmed 🎉',
                'body'  =>
                "Hi [CUSTOMER_NAME] 🎉\n" .
                    "Your booking has been confirmed!\n" .
                    "A trusted mechanic will be assigned shortly.\n" .
                    "🔖 Booking ID: [BOOKING_ID]",
            ],

            // 5. Mechanic Assigned
            'mechanic_assigned' => [
                'title' => 'Mechanic Assigned 🔧',
                'body'  =>
                "Hi [CUSTOMER_NAME]\n" .
                    "A mechanic has been assigned to your service request.\n" .
                    "They will reach out to you soon!",
            ],

            // Booking Cancelled
            'booking_cancelled' => [
                'title' => 'Booking Cancelled ❌',
                'body'  =>
                "Hi [CUSTOMER_NAME]\n" .
                    "Your service request ([BOOKING_ID]) has been cancelled ❌.",
            ],

            // Advance Payment Request
            'advance_payment' => [
                'title' => 'Advance Payment Required 💳',
                'body'  =>
                "Hi [CUSTOMER_NAME]\n" .
                    "Your booking request has been accepted 👍.\n" .
                    "Tap here to pay ₹100 and secure your preferred time slot.",
            ],

            // Payment Successful
            'payment_successful' => [
                'title' => 'Payment Successful 🎉',
                'body'  =>
                "Thank you for your payment! 🎉\n" .
                    "Your booking ([BOOKING_ID]) is now confirmed.",
            ],

            // Video Proof Uploaded
            'video_uploaded' => [
                'title' => 'Video Proof Uploaded 🎥',
                'body'  =>
                "Hi [CUSTOMER_NAME]\n" .
                    "Video proof for [SERVICE_NAME] has been uploaded 🎥.\n" .
                    "Please check your booking for details.",
            ],

            // Service Completed
            'service_completed' => [
                'title' => 'Service Completed 🚗✨',
                'body'  =>
                "Hi [CUSTOMER_NAME]\n" .
                    "Your vehicle service is complete and ready for pickup 🚗✨.",
            ],

        ][$event] ?? null;
    }
}



if (!function_exists('parseNotificationTemplate')) {

    function parseNotificationTemplate($template, $data)
    {
        $body = $template['body'];
        $title = $template['title'];

        // Replace placeholders in both title and body
        foreach ($data as $key => $value) {
            $body = str_replace('[' . $key . ']', $value, $body);
            $title = str_replace('[' . $key . ']', $value, $title);
        }

        return [
            'title' => $title,
            'body'  => $body,
        ];
    }
}
