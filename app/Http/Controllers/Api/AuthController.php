<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FcmToken;
use App\Models\User;
use App\Msg91;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

use function App\activityLog;

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
            $validated = $request->validate([
                'phone' => 'required|digits:10',
                'user_type' => 'required|in:customer,mechanic',
            ]);

            $existingUser = User::where('phone', $validated['phone'])->first();
            if ($existingUser && $existingUser->status == 0) {

                activityLog($existingUser, "login attempt", "User attempted login but account is inactive.");
                return response()->json([
                    'status' => false,
                    'message' => "Your account is blocked. Please contact the administrator.",
                ], 403);
            }

            if ($existingUser && $existingUser->role !== $validated['user_type']) {
                return response()->json([
                    'status' => false,
                    'message' => "You are already registered as {$existingUser->role}.",
                ], 422);
            }

            if ($existingUser) {
                $user = $existingUser;
            } else {
                $user = User::create([
                    'phone' => $validated['phone'],
                    'role' => $validated['user_type'],
                ]);
            }

            // $otp = rand(100000, 999999);
            // $wpi = new Msg91;
            // $resp = $wpi->sendOTP($user->phone, $otp);
            // if ($resp['status']) {
            //     $user->update([
            //         'otp' => $otp,
            //         'otp_expire' => now()->addMinutes(2),
            //     ]);
            // }

            $user->update([
                'otp' => 123456,
                'otp_expire' => now()->addMinutes(2),
            ]);

            activityLog($user, "OTP sent", "Login OTP sent successfully.");

            return response()->json([
                'status' => true,
                'message' => "OTP sent successfully.",
                'user' => $user
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => "Validation failed.",
                'errors' => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => "Something went wrong. Please try again later.",
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
                'fcm_token' => 'nullable',
            ]);

            $user = User::where('phone', $request->phone)->first();
            if ($user->status == 0) {
                return response()->json([
                    'status' => false,
                    'message' => "Your account is blocked. Please contact the administrator.",
                ], 500);
            }
            if (!$user) {
                throw ValidationException::withMessages([
                    'email' => ['Phone number not registered'],
                ]);
            }

            // Check if OTP is expired
            if (Carbon::now()->gt(Carbon::parse($user->otp_expire))) {
                $msg = "otp verification failed due to otp is expired";
                activityLog($user, "otp verification failed", $msg);

                return response()->json([
                    'status' => false,
                    'message' => 'OTP has expired. Please request a new one.',
                ], 400);
            }

            // Check if OTP is incorrect
            if ($request->otp != $user->otp) {
                $msg = "otp verification failed due to invalid otp";
                activityLog($user, "otp verification failed", $msg);

                return response()->json([
                    'status' => false,
                    'message' => 'Invalid OTP.',
                ], 400);
            }

            $token = $user->createToken('api_token')->plainTextToken;
            $user->load([
                'vehicles'
            ]);

            FcmToken::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'user_id' => $user->id,
                    'token' => $request->fcm_token
                ]
            );

            $msg = "login verification otp verified";
            activityLog($user, "login otp verified", $msg);

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
            $user = $request->user();
            $token = $request->user()->currentAccessToken();

            $msg = "user logout succesfully";
            activityLog($user, "user logout", $msg);

            $token->delete();

            return response()->json([
                'status' => true,
                'message' => 'Logged out successfully',
            ]);
        } catch (Exception $e) {
            $msg = "user logout succesfully";
            activityLog($request->user(), "user logout", $msg);
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
}
