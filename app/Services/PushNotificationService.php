<?php

namespace App\Services;

use GuzzleHttp\Client;
use App\Models\UserNotification;
use Exception;

class PushNotificationService
{
    /**
     * Write code on Method
     *
     * @return response()
     */
    public static function sendPushNotification__($notificationData)
    {
        try {
            // Define the device registration tokens
            $registrationIds = [$notificationData['deviceToken']];

            $data = [
                "registration_ids" => $registrationIds,
                "notification" => [
                    "title" => $notificationData['title'],
                    "body" => $notificationData['body'],
                ]
            ];

            $dataString = json_encode($data);

            $headers = [
                'Authorization: key=' . config('services.fcm.fcm_server_key'),
                'Content-Type: application/json',
            ];

            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, config('services.fcm.fcm_url'));
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);

            $response = curl_exec($ch);
            return back()->with('success', 'Notification send successfully.');
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public static function sendPushNotification($notificationData)
    {

        $serverKey = config('services.fcm.fcm_server_key');

        $headers = [
            'Authorization' => 'key=' . $serverKey,
            'Content-Type'  => 'application/json',
        ];

        // Define the device registration tokens
        $registrationIds = [$notificationData['deviceToken']];

        $bodyData = [
            "registration_ids" => $registrationIds,
            "notification" => [
                "title" => $notificationData['title'],
                "body" => $notificationData['body'],
            ]
        ];

        $fields = json_encode($bodyData);
        $client = new Client();
        try {
            $request = $client->post(config('services.fcm.fcm_url'), [
                'headers' => $headers,
                "body" => $fields,
            ]);

            $response = $request->getBody();
            return $response;
        } catch (Exception $e) {
            return $e;
        }
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public static function saveUserNotification($notificationData)
    {
        try {
            $data['from_user_id'] = $notificationData['from_user_id'];
            $data['to_user_id'] = $notificationData['to_user_id'];
            $data['product_id'] = $notificationData['product_id'];
            $data['order_id'] = $notificationData['order_id'];
            $data['type'] = $notificationData['type'];
            $data['title'] = $notificationData['title'];
            $data['message'] = $notificationData['message'];
            $data['message_body'] = json_encode($notificationData['message_body']);
            return UserNotification::create($data);
        } catch (Exception $e) {
            return $e;
        }
    }
}
