<?php

namespace App\Http\Controllers\Api;

use App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

use function App\uploadRequestFile;

class ProfileController extends Controller
{
    /**
     * Update Profile
     * @param Request $request
     * @return mixed
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();

            $request->validate([
                'name' => ['required'],
                'email' => ['required', Rule::unique('users', 'email')->ignore($user)],
                'phone' => ['required', Rule::unique('users', 'phone')->ignore($user)],
                'dob' => ['required'],
                'address_type' => ['required'],
                'country' => ['required'],
                'state' => ['required'],
                'city' => ['required'],
                'address' => ['required'],
                'pincode' => ['required'],
                'profile_photo' => [
                    'nullable',
                    'image',
                    'mimes:jpg,jpeg,png,webp',
                    'max:2048'
                ],
            ]);

            $user->update([
                'name' => $request->name,
                'last_name' => $request->last_name,
                'dob' => Carbon::parse($request->dob)->format('Y-m-d'),
                'email' => $request->email,
                'phone' => $request->phone,
                'whatsapp_number' => $request->whatsapp_number,
                'is_profile_updated' => 1,
            ]);

            if ($request->profile_photo) {
                uploadRequestFile($request, 'profile_photo', $user, 'users_photos', 'profile_pic');
            }


            $address = UserAddress::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'address_type' => $request->address_type,
                    'is_default_address' => 1,
                    'country_id' => $request->country,
                    'state_id' => $request->state,
                    'city_id' => $request->city,
                    'address' => $request->address,
                    'pincode' => $request->pincode,
                ]
            );

            return response()->json([
                'status' => true,
                'message' => 'Profile updated successfully',
                'user' => $user,
                'address' => $address
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Update Profile Image
     * @param Request $request
     * @return mixed
     */
    public function updateProfileImage(Request $request)
    {
        try {
            $request->validate([
                'profile_photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);

            $user = $request->user();

            if ($request->profile_photo) {
                if ($user->profile_pic && Storage::exists($user->profile_pic)) {
                    Storage::delete($user->profile_pic);
                }
                uploadRequestFile($request, 'profile_photo', $user, 'users_photos', 'profile_pic');
            }

            return response()->json([
                'status' => true,
                'message' => 'Profile picture updated successfully.',
                'profile_photo_url' => $user->profile_photo_url,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Save Address
     * @param Request $request
     * @return mixed
     */
    public function saveAddress(Request $request)
    {
        try {
            $request->validate([
                'country' => 'required',
                'state' => 'required',
                'city' => 'required',
                'address' => [
                    'required',
                    Rule::unique('user_addresses', 'address')
                ],
                'pincode' => [
                    'required',
                    'digits:6'
                ],
                'address_type' => ['required'],
            ]);

            $user = $request->user();
            $address = UserAddress::create([
                'user_id' => $user->id,
                'country_id' => $request->country,
                'state_id' => $request->state,
                'city_id' => $request->city,
                'address' => $request->address,
                'pincode' => $request->pincode,
                'address_type' => $request->address_type,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Address added successfully.',
                'address' => $address
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Update Address
     * @param Request $request
     * @param string $uuid Address UUID
     * @return mixed
     */
    public function updateAddress(Request $request, $uuid)
    {
        try {
            $address = UserAddress::firstWhere('uuid', $uuid);
            if (!$address) {
                return response()->json([
                    'status' => false,
                    'message' => "Address does not exist",
                ], 404);
            }


            $request->validate([
                'country' => 'required',
                'state' => 'required',
                'city' => 'required',
                'address' => [
                    'required',
                    Rule::unique('user_addresses', 'address')->ignore($address)
                ],
                'pincode' => [
                    'required',
                    'digits:6'
                ],
                'address_type' => ['required'],
            ]);

            $address->update([
                'country_id' => $request->country,
                'state_id' => $request->state,
                'city_id' => $request->city,
                'address' => $request->address,
                'pincode' => $request->pincode,
                'address_type' => $request->address_type,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Address updated successfully.',
                'address' => $address
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Fetch User Address List
     * @return mixed
     */
    public function getAddressList(Request $request)
    {
        try {
            $user = $request->user();
            return $user->addresses ?? [];
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Delete Address
     * @param string $uuid Address UUID
     * @return mixed
     */
    public function deleteAddress($uuid)
    {
        try {
            $address = UserAddress::firstWhere('uuid', $uuid);
            if (!$address) {
                return response()->json([
                    'status' => false,
                    'message' => 'Address does not exist',
                ], 500);
            }

            $address->delete();
            return response()->json([
                'status' => true,
                'message' => 'Address deleted successfully.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
