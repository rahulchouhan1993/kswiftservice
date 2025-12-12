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
        $deviceToken = "c0DIeVz0ToaHD-l-W6WYIk:APA91bGcK9GlCTH9LWOl-zhEzZqUjxmXlMBLGF39PYX2AyKHOa4Q6I66B0tZQeTAwLUxcHMfdfIrhm99oBvySw5AqMXTcaG7DtZOdVVv50QhEqZRkjOYWWY";
        $title = "Test notification";
        $body = "This is notification body";

        $temp = getNotificationTemplate('booking_confirmed');
        $uData = [
            'customer_name' => 'Vikas Sain',
            'booking_id' => 'BTXN_1234567890',
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
