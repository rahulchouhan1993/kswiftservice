<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\PushNotification;
use Illuminate\Http\Request;

use function App\getNotificationTemplate;
use function App\parseNotificationTemplate;

class TestController extends Controller
{
    /**
     * Send Push Notification
     * @param Request $request
     * @return mixed
     */
    use PushNotification;
    public function sendNotification(Request $request)
    {
        $deviceToken = "cIH9aakvQ7qBpbYJ6yyz8g:APA91bGWLH-Iow50eMTWux6kLyOZ9hUjG8hn5AlGUduLg_N8LRn19X7ME82r39dsyPHzolZVg9oBEJ3Hm2fvlmrQOqSAR4cs8vu2OSiOhGAA5r6ZqgjBntY";
        $title = "Test notification";
        $body = "This is notification body";

        $temp = getNotificationTemplate('booking_confirmed');
        $uData = [
            'CUSTOMER_NAME' => 'Vikas Sain',
            'BOOKING_ID' => 'BTXN_1234567890',
        ];
        $tempWData = parseNotificationTemplate($temp, $uData);

        $data = [
            'key1' => 'value1',
            'key2' => 'value2',
        ];

        $resp = $this->sendPushNotification($deviceToken, $tempWData, $data);
        return response()->json([
            'status' => true,
            'response' => $resp
        ]);
    }
}
