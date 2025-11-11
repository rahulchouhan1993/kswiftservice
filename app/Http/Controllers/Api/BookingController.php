<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingService;
use App\Models\UserAddress;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BookingController extends Controller
{
    /**
     * Book Service
     * @param Request $request
     */
    public function bookService(Request $request)
    {
        try {
            $validated = $request->validate([
                'services' => [
                    'required',
                    'array',
                    'min:1'
                ],
                'services.*' => [
                    'integer',
                    'exists:service_types,id'
                ],
                'date' => [
                    'required',
                    'date_format:d-m-Y',
                    'after_or_equal:today'
                ],
                'time' => [
                    'required',
                    'date_format:g:i A'
                ],
                'pickup_type' => [
                    'required',
                    Rule::in(['pickup', 'self_drop'])
                ],
                'pickup_address' => [
                    Rule::requiredIf(fn() => $request->pickup_type === 'pickup'),
                    'nullable',
                    'integer',
                    'exists:user_addresses,id'
                ],
            ], [
                'services.required' => 'Please select at least one service.',
                'services.*.exists' => 'One or more selected services are invalid.',
                'date.after_or_equal' => 'The date cannot be in the past.',
                'pickup_address.required' => 'Pickup address is required when pickup type is selected.',
            ]);

            $user = $request->user();
            if ($request->pickup_type == 'pickup') {
                $address = UserAddress::find($request->pickup_address);
                if (!$address) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Pickupp address does not exist.',
                    ], 404);
                }
            }

            $booking = Booking::create([
                'user_id' => $user->id,
                'date' => Carbon::parse($request->date)->format('Y-m-d'),
                'time' => $request->time,
                'pickup_type' => $request->pickup_type,
            ]);

            if ($request->pickup_type == 'pickup') {
                $booking->update([
                    'user_address_id' => $address->id,
                ]);
            }

            foreach ($request->services as $service) {
                BookingService::create([
                    'user_id' => $user->id,
                    'booking_id' => $booking->id,
                    'service_type_id' => $service,
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Booking request submitted successfully.',
                'booking' => $booking
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
