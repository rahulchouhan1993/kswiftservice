<?php

namespace App;

use Exception;
use Google\Auth\ApplicationDefaultCredentials;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

trait PushNotification
{
    public function sendPushNotification($token, $tempData, $data = [])
    {
        $title = $tempData['title'] ?? null;
        $body  = $tempData['body'] ?? null;

        $fcmUrl = "https://fcm.googleapis.com/v1/projects/kswiftservice/messages:send";
        $notification = [
            'notification' => [
                'title' => $title,
                'body'  => $body,
            ],
            'data'  => $data,
            'token' => $token
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->getAccessToken(),
                'Content-Type'  => 'application/json',
            ])->post($fcmUrl, ['message' => $notification]);

            return $response->json();
        } catch (Exception $e) {
            Log::error("Error sending push notifications: " . $e->getMessage());
            return false;
        }
    }


    private function getAccessToken()
    {
        $keyPath = config('services.firebase.key_path');

        putenv('GOOGLE_APPLICATION_CREDENTIALS=' . $keyPath);

        $scopes = ['https://www.googleapis.com/auth/firebase.messaging'];
        $credential = ApplicationDefaultCredentials::getCredentials($scopes);
        $token = $credential->fetchAuthToken();

        return $token['access_token'] ?? null;
    }
}
