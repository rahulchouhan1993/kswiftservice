<?php

namespace App\Http\Controllers\Api;

use App\FacebookApi;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingAcceptRequest;
use App\Models\BookingRequest;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Throwable;

use function App\activityLog;
use function App\createMessageData;
use function App\createMessageHistory;
use function App\generateParameters;

class BookingRequestController extends Controller
{
    /**
     * Display Booking Requests List
     */
    public function list(Request $request)
    {
        try {
            $user = $request->user();   
            $bookingRequests = BookingRequest::with([
                'user',
                'booking',
            ])
                ->where('mecanic_id', $user->id)
                ->orderBy('created_at', 'DESC')
                ->get();

            if ($bookingRequests->isEmpty()) {
                return response()->json([
                    'status' => true,
                    'message' => 'No booking requests found.',
                    'bookings' => []
                ], 200);
            }

            $response = $bookingRequests->map(function ($bRequest) {
                $user = $bRequest->user;
                $booking = $bRequest->booking;
                $vehicle = optional($booking)->vehicle;
                $vehicleMake = optional($vehicle)->vehicle_make;

                return [
                    'id' => $bRequest->id,
                    'uuid' => $bRequest->uuid,
                    'mecanic_id' => $bRequest->mecanic_id,
                    'mechanic_status' => $bRequest->mechanic_status,
                    'note' => $bRequest->note,
                    'rejection_reason' => $bRequest->rejection_reason,
                    'astimated_delivery_date' => $bRequest->astimated_delivery_date,
                    'last_updated_at' => $bRequest->last_updated_at,
                    'admin_status' => $bRequest->admin_status,

                    // ✅ USER
                    'user' => $user ? [
                        'user_id'   => $user->id,
                        'user_name' => $user->name,
                    ] : null,

                    // ✅ BOOKING
                    'booking' => $booking ? [
                        'booking_id'   => $booking->id,
                        'booking_uuid' => $booking->uuid,
                        'additional_note' => $booking->additional_note,

                        // ✅ VEHICLE
                        'vehicle' => $vehicle ? [
                            'vehicle_id'     => $vehicle->id,
                            'vehicle_type'   => $vehicle->vehicle_type,
                            'vehicle_number' => $vehicle->vehicle_number,
                            'model'          => $vehicle->model,
                            'vehicle_year'   => $vehicle->vehicle_year,
                            'fuel_type'      => $vehicle->fuel_type,
                            'transmission'   => $vehicle->transmission,
                            'mileage'        => $vehicle->mileage,

                            // ✅ VEHICLE MAKE
                            'vehicle_make' => $vehicleMake ? [
                                'make_id'   => $vehicleMake->id,
                                'make_name' => $vehicleMake->name,
                            ] : null,

                            // ✅ PHOTOS
                            'vehicle_photos' => $vehicle->vehicle_photos
                                ? $vehicle->vehicle_photos->map(function ($photo) {
                                    return [
                                        'uuid' => $photo->uuid,
                                        'photo_url' => $photo->photo_url,
                                    ];
                                })->values()
                                : [],
                        ] : null,

                        // ✅ PICKUP ADDRESS
                        'pickup_address' => optional($booking->pickup_address)->id ? [
                            'id' => $booking->pickup_address->id,
                            'address' => $booking->pickup_address->address,
                            'city_id' => $booking->pickup_address->city_id,
                            'state_id' => $booking->pickup_address->state_id,
                            'country_id' => $booking->pickup_address->country_id,
                            'pincode' => $booking->pickup_address->pincode,
                        ] : null,

                        // ✅ DROP ADDRESS
                        'drop_address' => optional($booking->drop_address)->id ? [
                            'id' => $booking->drop_address->id,
                            'address' => $booking->drop_address->address,
                            'city_id' => $booking->drop_address->city_id,
                            'state_id' => $booking->drop_address->state_id,
                            'country_id' => $booking->drop_address->country_id,
                            'pincode' => $booking->drop_address->pincode,
                        ] : null,
                    ] : null,
                ];
            });

            return response()->json([
                'status' => true,
                'message' => 'Bookings fetched successfully.',
                'bookings' => $response,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Accept/Reject Booking Request
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
    */
    public function acceptOrRejectBookingRequest(Request $request)
    {
        try{
            $user = $request->user();
            $request->validate([
                'request_uuid' => 'required|string|exists:booking_requests,uuid',
                'status' => 'required|string|in:accepted,rejected',
                'rejection_reason' => 'required_if:status,rejected|string|nullable',
                'note' => 'nullable|string',
                'astimated_delivery_date' => 'required_if:status,accepted|nullable|date',
            ]);

            $mechanic = User::find($user->id);
            $bookingRequest = BookingRequest::where('uuid', $request->request_uuid)->firstOrFail();
            $booking = $bookingRequest->booking;

            if(!$bookingRequest){
                return response()->json([
                    'status' => false,
                    'message' => 'Booking request does not exist.',
                ], 400);
            }

            if($bookingRequest->mechanic_status != 'pending'){
                return response()->json([
                    'status' => false,
                    'message' => 'You have already submitted a response.',
                ], 400);
            }

            $bookingRequest->update([
                'note' => $request->note,
                'astimated_delivery_date' => $request->astimated_delivery_date ? Carbon::parse($request->astimated_delivery_date) : null,
                'last_updated_at' => Carbon::now(),
                'mechanic_status' => $request->status,
                'rejection_reason' => $request->rejection_reason ?? null,
            ]);

            if (env("CAN_SEND_MESSAGE") && $mechanic) {
                try {
                    $lang = "en";
                    if($request->status == 'accepted'){
                        $templateName = "msg_to_mechanic_on_accept_booking_request";
                    }else{
                        $templateName = "msg_to_mechanic_on_reject_booking_request";
                    }
                    $phone = $mechanic->phone;
                    $data = [
                        $mechanic->name,
                        $booking->booking_id,
                    ];
                    $perameters = generateParameters($data);
                    $msgData = createMessageData($phone, $templateName, $lang, $perameters);
                    $fb = new FacebookApi();
                    $resp = $fb->sendMessage($msgData);
                    createMessageHistory($templateName, $mechanic, $phone, $resp);
                } catch (Throwable $e) {
                    activityLog($mechanic, "send message error", $e->getMessage());
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Booking request ' . $request->status . ' successfully.',
            ], 200);
        }catch(Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}