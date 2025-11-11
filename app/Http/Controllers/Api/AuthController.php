<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register User
     * @param Request $request
     * @return mixed
     */
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                'email' => 'required|email|unique:users',
                'password' => 'required|confirmed',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => $request->password
            ]);

            $token = $user->createToken('api_token')->plainTextToken;
            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Login User
     * @param Request $request
     * @return mixed
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }

            $token = $user->createToken('api_token')->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * OTP Login
     * @param Request $request
     * @return mixed
     */
    public function OTPlogin(Request $request)
    {
        try {
            $request->validate([
                'phone' => 'required|digits:10'
            ]);

            $user = User::where('phone', $request->phone)->first();
            if (!$user) {
                $user = User::create([
                    'phone' => $request->phone
                ]);
            }

            $otp = rand(000000, 999999);
            $user->update([
                'otp' => $otp,
                'otp_expire' => Carbon::now()->addMinutes(2)
            ]);

            return response()->json([
                'message' => 'OTP Sent Successful',
                'user' => $user,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Verify OTP
     * @param Request $request
     * @return mixed
     */
    public function verifyOTP(Request $request)
    {
        try {
            $request->validate([
                'phone' => 'required|digits:10',
                'otp' => 'required|digits:6',
            ]);

            $user = User::where('phone', $request->phone)->first();
            if (!$user) {
                throw ValidationException::withMessages([
                    'email' => ['Phone number not registered'],
                ]);
            }

            // Check if OTP is expired
            if (Carbon::now()->gt(Carbon::parse($user->otp_expire))) {
                return response()->json([
                    'status' => false,
                    'message' => 'OTP has expired. Please request a new one.',
                ], 400);
            }

            // Check if OTP is incorrect
            if ($request->otp != $user->otp) {
                return response()->json([
                    'status' => false,
                    'message' => 'Invalid OTP.',
                ], 400);
            }

            $token = $user->createToken('api_token')->plainTextToken;
            return response()->json([
                'status' => true,
                'message' => 'OTP verified successfully.',
                'user' => $user,
                'token' => $token
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Logout User
     * @param Request $request
     * @return mixed
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'message' => 'Logged out successfully',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
