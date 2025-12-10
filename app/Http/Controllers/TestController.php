<?php

namespace App\Http\Controllers;

use App\PushNotification;
use Illuminate\Http\Request;

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
        $deviceToken = "";
        $title = "Test notification";
        $body = "This is notification body";

        $data = [
            'key1' => 'value1',
            'key2' => 'value2',
        ];

        $resp = $this->sendPushNotification($deviceToken, $title, $body, $data);

        return response()->json([
            'status' => true,
            'response' => $resp
        ]);
    }
}
