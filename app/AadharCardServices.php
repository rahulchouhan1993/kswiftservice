<?php

namespace App;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AadharCardServices
{
    protected string $key;
    protected string $secret;
    protected string $version;
    protected string $base_path;

    public function __construct()
    {
        $this->key = config('services.aadhar.key');
        $this->secret = config('services.aadhar.secret');
        $this->version = config('services.aadhar.version');
        $this->base_path = config('services.aadhar.base_path');
    }


    /**
     * Get Aadhar Card Auth Token
     */
    private function getAuthToken()
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'x-api-key' => $this->key,
            'x-api-secret' => $this->secret,
            'x-api-version' => $this->version,
        ])->post($this->base_path . '/authenticate');

        if ($response->successful()) {
            return $response->json([
                'access_token'
            ]) ?? null;
        }
        return null;
    }


    /**
     * Request OTP for Aadhaar verification
     * @param string $aadhaarNumber  Aadhar Card Number
     */
    public function otpRequest($aadhaarNumber)
    {
        $authToken = $this->getAuthToken();
        if (!$authToken) {
            return ['status' => false, 'message' => 'Failed to generate authentication token'];
        }

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => $authToken,
            'Content-Type' => 'application/json',
            'x-api-key' => $this->key,
            'x-api-version' => $this->version,
        ])->post($this->base_path . '/kyc/aadhaar/okyc/otp', [
            '@entity' => 'in.co.sandbox.kyc.aadhaar.okyc.otp.request',
            'consent' => 'y',
            'reason' => 'For KYC',
            'aadhaar_number' => $aadhaarNumber,
        ]);

        if ($response->successful()) {
            return [
                'status' => true,
                'data' => $response->json(),
                'token' => $authToken
            ];
        }

        return [
            'status' => false,
            'message' => 'Failed to request OTP',
            'error' => $response->json(),
        ];
    }



    /**
     * Validate Aadhaar OTP
     */
    public function validateAadhaarOtp($otp, $referenceId, $token)
    {
        if (!$token) {
            return ['status' => false, 'message' => 'Invalid authentication token'];
        }

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => $token,
            'Content-Type' => 'application/json',
            'x-api-key' => $this->key,
            'x-api-version' => $this->version,
        ])->post($this->base_path . '/kyc/aadhaar/okyc/otp/verify', [
            '@entity' => 'in.co.sandbox.kyc.aadhaar.okyc.request',
            'reference_id' => "$referenceId",
            'otp' => $otp,
        ]);

        return $response->json();
    }
}
