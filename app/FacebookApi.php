<?php

namespace App;

use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class FacebookApi
{

    private $access_token,
        $phone_id,
        $whatsapp_ac_id,
        $graph_url = 'https://graph.facebook.com',
        $graph_version = 'v24.0',
        $app_id;

    public function __construct()
    {
        $this->access_token = env('APP_ACCESS_TOKEN');
        $this->phone_id = env('PHONE_NUMBER_ID');
        $this->whatsapp_ac_id = env('BUSINESS_ACCOUNT_ID');
        $this->app_id = env('APP_ID');
    }

    /**
     * Send WhatsApp message via API
     *
     * @param array $msgData
     * @return array
     */
    public function sendMessage($msgData)
    {
        $req = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $this->access_token
        ])->post($this->graph_url . '/' . $this->graph_version . '/' . $this->phone_id . '/messages', $msgData);

        if ($req->successful()) {
            return [
                'status' => true,
                'result' => $req->json()
            ];
        }

        return [
            'status' => false,
            'result' => $req->json()
        ];
    }


    /**
     * Send WhatsApp Text Message
     *
     * @param array $msgData
     * @return array
     */
    public function sendTextMessage($phone, $message)
    {
        $msgData = [
            "messaging_product" => "whatsapp",
            "recipient_type" => "individual",
            "to" => $phone,
            "type" => "text",
            "text" => [
                "preview_url" => true,
                "body" => $message
            ]
        ];

        $req = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $this->access_token
        ])->post($this->graph_url . '/' . $this->graph_version . '/' . $this->phone_id . '/messages', $msgData);

        if ($req->successful()) {
            return [
                'status' => true,
                'result' => $req->json()
            ];
        }

        return [
            'status' => false,
            'result' => $req->json()
        ];
    }
}
