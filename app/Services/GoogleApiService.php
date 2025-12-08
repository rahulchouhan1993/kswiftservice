<?php

namespace App\Services;

use Google_Client;

class GoogleApiService
{
    public static function getOAuth2Service()
    {
        $client = new Google_Client();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setScopes(['https://www.googleapis.com/auth/youtube.force-ssl']); // Add scopes as needed

        return $client;
    }
}
