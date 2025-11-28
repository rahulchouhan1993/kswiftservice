<?php

namespace App\Http\Controllers\Api;

use App\AadharCardServices;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;

class AadharCardController extends Controller
{
    /**
     * Aadhar Card Verification
     * @param Request $request
     * @return mixed
     */
    public function sendVerificationOTP(Request $request)
    {
        try {
            $request->validate([
                'aadhar_card_number' => [
                    'required',
                    'digits:12'
                ]
            ]);

            $aadhar = new AadharCardServices();
            $resp = $aadhar->otpRequest($request->aadhar_card_number);
            if ($resp['status']) {

                $refId = $resp['data']['data']['reference_id']
                    ?? $resp['data']['transaction_id']
                    ?? null;

                return response()->json([
                    "status" => true,
                    "message" => "OTP Sent successfully",
                    "ref_id" => $refId,
                    "token" => $resp['token']
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" =>  $resp['error']['message'] ?? $resp['message'],
                    "transaction_id" => $resp['error']['transaction_id'] ?? null,
                ]);
            }


            $user = $request->user();
            if ($user->role != 'mechanic') {
                return response()->json([
                    'status' => false,
                    'message' => 'Only mechanic can need to KYC verification.',
                ], 500);
            }
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Verify Aadhar Card OTP
     * @param Request $request
     * @return mixed
     */
    public function verifyVerificationOTP(Request $request)
    {
        try {
            $request->validate([
                'phone' => [
                    'required',
                    'digits:10'
                ],
                'aadharcard_no' => [
                    'required',
                    'digits:12'
                ],
                'otp' => [
                    'required',
                ],
                'reference_id' => [
                    'required',
                ],
                'token' => [
                    'required',
                ],
            ]);


            $user = User::wherePhone($request->phone)->first();
            if (!$user) {
                return response()->json([
                    "status" => false,
                    "message" => "User does not exist",
                ]);
            }

            if ($user->role != 'mechanic') {
                return response()->json([
                    "status" => false,
                    "message" => "Only mechanics are allowed to complete Aadhaar verification.",
                ]);
            }

            $aadhar = new AadharCardServices();
            $resp = $aadhar->validateAadhaarOtp($request->otp, $request->reference_id, $request->token);
            if (isset($resp['data']) && isset($resp['data']['status'])) {
                $user->update([
                    'aadharcard_no' => $request->aadharcard_no,
                    'kyc_status' => 'complete',
                    'kyc_response' => $resp['data']
                ]);

                return response()->json([
                    "status" => true,
                    "message" => "KYC Verified succesfully",
                    'user' => $user
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => $resp['message'] ?? ($resp['data']['message'] ?? 'Something went wrong'),
                ]);
            }
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
