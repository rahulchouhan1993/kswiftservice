<?php

namespace App;

use Illuminate\Support\Facades\Http;

/**
 * SMS Service By Msg91
 * Class To send SMS & OTP
 *
 * @version v5
 * @see https://docs.msg91.com/reference/overview
 */
class Msg91
{

    /**
     * Get MSG91 API Host
     * @return string
     */
    public static function getHost()
    {
        return env('MSG91_HOST');
    }

    /**
     * Get MSG91 OTP template Id
     * @return string
     */
    public static function getOtpTemplateId()
    {
        return env('MSG91_OTP_TEMPLATE');
    }

    /**
     * Get MSG91 API Token
     * @return string
     */
    private static function getToken()
    {
        return env('MSG91_TOKEN');
    }

    /**
     * Send OTP Using MSG91
     *
     * @param string $num Mobile Number
     * @param int   $otp OTP 6 digit
     * @return array
     */
    public static function sendOTP($num, $otp)
    {
        $payload = [
            "template_id" => static::getOtpTemplateId(),
            "recipients" => [
                [
                    "mobiles" => '91' . $num,
                    "var1" => $otp
                ]
            ]
        ];

        $headers = [
            'authkey' => static::getToken(),
            'Content-Type' => 'application/json'
        ];
        $req = Http::withHeaders($headers)->post(static::getHost(), $payload);

        if ($req->successful()) {
            return [
                'status' => true,
                'data' => $req->json()
            ];
        }
        return [
            'status' => false,
            'data' => $req->json()
        ];
    }

    /**
     * Verify OTP Using MSG91
     *
     * @param string $num Mobile Number
     * @return array
     */
    public static function verifyOTP($num, $otp)
    {
        $url = static::getHost() . "/api/v5/otp/verify?otp=$otp&mobile=91$num";
        $req = Http::withHeaders([
            'accept' => 'application/json',
            'content-type' => 'application/json',
            'authkey' => static::getToken()
        ])->post($url);

        if ($req->successful()) {
            return [
                'status' => true,
                'data' => $req->json()
            ];
        }
        return [
            'status' => false,
            'data' => $req->json()
        ];
    }
}
