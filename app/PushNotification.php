<?php

namespace App;

use Exception;
use Google\Auth\ApplicationDefaultCredentials;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

trait PushNotification
{
    public function sendPushNotification($token, $title, $body, $data = [])
    {
        $fcmUrl = "https://fcm.googleapis.com/v1/projects/kswiftservice/messages:send";
        $notification = [
            'notification' => [
                'title' => $title,
                'body' => $body
            ],
            'data' => $data,
            'token' => $token
        ];


        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'content-Type' => 'application/json',
            ])->post($fcmUrl, ['message' => $notification]);

            return $response->json();
        } catch (Exception $e) {
            Log::info("Error sending push notifications");
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
