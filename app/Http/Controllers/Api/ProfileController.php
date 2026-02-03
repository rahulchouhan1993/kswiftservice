<?php

namespace App\Http\Controllers\Api;

use App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\MechanicJob;
use App\Models\Ticket;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\UserChat;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

use function App\activityLog;
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
                'phone' => [
                    'required',
                    'digits:10',
                    Rule::unique('users', 'phone')->ignore($user)
                ],
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

            $msg = "profile updated";
            activityLog($user, "profile updated", $msg);

            return response()->json([
                'status' => true,
                'message' => 'Profile updated successfully',
                'user' => $user,
                'address' => $address
            ]);
        } catch (Exception $e) {
            $msg = "error during profile updation - " . $e->getMessage();
            activityLog($request->user(), "error during profile updation", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Get User Details
     * @param string $uuid user UUID
     * @return mixed
     */
    public function getUserDetails($uuid)
    {
        try {
            $user = User::with([
                'addresses',
                'addresses.state:id,name',
                'addresses.city:id,name',
                'vehicles'
            ])->firstWhere('uuid', $uuid);

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => "User does not exist",
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'User details fetched.',
                'user' => $user,
            ], 200);
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
            $user = $request->user();

            $request->validate([
                'profile_photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);


            if ($request->pofile_photo) {
                if ($user->profile_pic && Storage::exists($user->profile_pic)) {
                    Storage::delete($user->profile_pic);
                }
                uploadRequestFile($request, 'profile_photo', $user, 'users_photos', 'profile_pic');
            }

            $msg = "profile image updated";
            activityLog($user, "profile image updated", $msg);

            return response()->json([
                'status' => true,
                'message' => 'Profile picture updated successfully.',
                'profile_photo_url' => $user->profile_photo_url,
            ]);
        } catch (Exception $e) {
            $msg = "error during update profile image - " . $e->getMessage();
            activityLog($request->user(), "error during update profile image", $msg);

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
                'country'            => 'required',
                'state'              => 'required',
                'city'               => 'required',
                'address'            => 'required',
                'pincode'            => 'required|digits:6',
                'address_type'       => 'required',
                'is_default_address' => 'required|boolean',
            ]);

            $user = $request->user();

            DB::beginTransaction();
            if ($request->is_default_address) {
                UserAddress::where('user_id', $user->id)
                    ->update(['is_default_address' => 0]);
            }

            $address = UserAddress::create([
                'user_id'            => $user->id,
                'country_id'         => $request->country,
                'state_id'           => $request->state,
                'city_id'            => $request->city,
                'address'            => $request->address,
                'pincode'            => $request->pincode,
                'address_type'       => $request->address_type,
                'is_default_address' => $request->is_default_address ? 1 : 0,
            ]);

            DB::commit();

            activityLog($user, "user new address added", "user new address added");

            return response()->json([
                'status'  => true,
                'message' => 'Address added successfully.',
                'address' => $address
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            activityLog($request->user(), "error during save address", $e->getMessage());

            return response()->json([
                'status'  => false,
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
            $user = $request->user();

            $address = UserAddress::where('uuid', $uuid)
                ->where('user_id', $user->id)
                ->first();

            if (!$address) {
                return response()->json([
                    'status' => false,
                    'message' => "Address does not exist",
                ], 404);
            }

            $request->validate([
                'country'            => 'required',
                'state'              => 'required',
                'city'               => 'required',
                'address'            => 'required',
                'pincode'            => 'required|digits:6',
                'address_type'       => 'required',
                'is_default_address' => 'required|boolean',
            ]);

            DB::beginTransaction();
            if ($request->is_default_address) {
                UserAddress::where('user_id', $user->id)
                    ->where('id', '!=', $address->id)
                    ->update(['is_default_address' => 0]);
            }

            $address->update([
                'country_id'         => $request->country,
                'state_id'           => $request->state,
                'city_id'            => $request->city,
                'address'            => $request->address,
                'pincode'            => $request->pincode,
                'address_type'       => $request->address_type,
                'is_default_address' => $request->is_default_address ? 1 : 0,
            ]);

            DB::commit();

            activityLog($user, "address updated", "address updated");

            return response()->json([
                'status'  => true,
                'message' => 'Address updated successfully.',
                'address' => $address
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            activityLog($request->user(), "error during update address", $e->getMessage());

            return response()->json([
                'status'  => false,
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
    public function deleteAddress(Request $request, $uuid)
    {
        try {
            $user = $request->user();
            $address = UserAddress::firstWhere('uuid', $uuid);
            if (!$address) {
                return response()->json([
                    'status' => false,
                    'message' => 'Address does not exist',
                ], 500);
            }

            $address->delete();

            $msg = "address deleted";
            activityLog($user, "address deleted", $msg);

            return response()->json([
                'status' => true,
                'message' => 'Address deleted successfully.',
            ]);
        } catch (Exception $e) {
            $msg = "error during address deleted - " . $e->getMessage();
            activityLog($request->user(), "error during address deleted", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Set As Address
     * @param string $uuid Address UUID
     * @return mixed
     */
    public function setDefaultAddress(Request $request, $uuid)
    {
        try {
            $user = $request->user();

            $address = UserAddress::where('uuid', $uuid)
                ->where('user_id', $user->id)
                ->first();

            if (!$address) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Address does not exist',
                ], 404);
            }

            // 1️⃣ Reset all user's addresses
            UserAddress::where('user_id', $user->id)
                ->update(['is_default_address' => 0]);

            // 2️⃣ Set selected address as default
            $address->update([
                'is_default_address' => 1
            ]);

            $msg = "Address set as default address";
            activityLog($user, "address set as default address", $msg);

            return response()->json([
                'status'  => true,
                'message' => 'Address set as default successfully.',
            ], 200);
        } catch (Exception $e) {
            $msg = "Error during set default address - " . $e->getMessage();
            activityLog($request->user(), "error during set default address", $msg);

            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Get User Statictics
     * @param Request
     * @return mixed
     */
    public function getUserStatistics(Request $request)
    {
        try {
            $user = $request->user();
            if ($user->role === 'customer') {
                $pending_job = Booking::whereUserId($user->id)->whereStatus('pending')->count();
                $completed_bookings = Booking::whereUserId($user->id)->whereStatus('completed')->count();
                $closed_bookings = Booking::whereUserId($user->id)->whereStatus('closed')->count();
                $open_ticket_count = Ticket::whereUserId($user->id)->whereStatus('pending')->count();
                $unpaid_bookings = Booking::whereUserId($user->id)->whereDoesntHave('payment')->count();
                $bookingUnreadMsgCount = UserChat::whereNotNull('booking_id')->whereReceiverRole('customer')->where('to', $user->id)->whereNull('read_time')->count();
                $ticketUnreadMsgCount = UserChat::whereNull('booking_id')->whereReceiverRole('customer')->where('to', $user->id)->whereNull('read_time')->count();

                return response()->json([
                    'status'  => true,
                    'message' => "Customer statistics fetched",
                    'data' => [
                        'pending_job' => $pending_job,
                        'completed_bookings' => $completed_bookings,
                        'completed_bookings' => $completed_bookings,
                        'closed_bookings' => $closed_bookings,
                        'open_ticket_count' => $open_ticket_count,
                        'unpaid_bookings' => $unpaid_bookings,
                        'booking_unread_msg_count' => $bookingUnreadMsgCount,
                        'ticket_unread_msg_count' => $ticketUnreadMsgCount,
                    ]
                ], 201);
            } elseif ($user->role === 'mechanic') {
                $pending_jobs = MechanicJob::whereUserId($user->id)->whereStatus('pending')->count();
                $completed_jobs = MechanicJob::whereUserId($user->id)->whereStatus('completed')->count();
                $open_ticket_count = Ticket::whereUserId($user->id)->whereStatus('pending')->count();
                $unpaid_bookings = Booking::whereMechanicId($user->id)->whereDoesntHave('payment')->count();
                $bookingUnreadMsgCount = UserChat::whereNotNull('booking_id')->whereReceiverRole('mechanic')->where('to', $user->id)->whereNull('read_time')->count();
                $ticketUnreadMsgCount = UserChat::whereNull('booking_id')->whereReceiverRole('mechanic')->where('to', $user->id)->whereNull('read_time')->count();

                return response()->json([
                    'status'  => true,
                    'message' => "Mechanic statistics fetched",
                    'data' => [
                        'pending_jobs' => $pending_jobs,
                        'completed_jobs' => $completed_jobs,
                        'open_ticket_count' => $open_ticket_count,
                        'unpaid_bookings' => $unpaid_bookings,
                        'booking_unread_msg_count' => $bookingUnreadMsgCount,
                        'ticket_unread_msg_count' => $ticketUnreadMsgCount,
                    ]
                ], 201);
            }
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
