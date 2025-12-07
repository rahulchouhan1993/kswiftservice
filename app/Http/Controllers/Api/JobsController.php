<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\MechanicJob;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

use function App\activityLog;

class JobsController extends Controller
{
    /**
     * Fetch Jobs Request List
     * @param Request $request
     * @param string $status
     * @return mixed
     */
    public function fetchJobsList(Request $request, $status)
    {
        try {
            $user = $request->user();
            if (!in_array($status, ['pending', 'accepted', 'rejected', 'completed'])) {
                return response()->json([
                    'status'  => false,
                    'message' => "Status can be [pending, accepted, rejected, completed]"
                ], 500);
            }


            $jobs = MechanicJob::with([
                'booking',
                'booking.services.service_type',
                'booking.vehicle.vehicle_photos'
            ])
                ->whereStatus($status)
                ->whereUserId($user->id)
                ->orderBy('created_at', 'DESC')
                ->get();

            $data = $jobs->map(function ($job) {

                $booking = $job->booking;
                $vehiclePhoto = optional($booking->vehicle->vehicle_photos->first())->photo_url;
                $bookingId = $booking->booking_id;
                $bookingCreatedAt = $booking->created_at->format('d M Y');
                $totalServicePrice = $booking->services->sum(function ($service) {
                    return $service->service_type->base_price ?? 0;
                });

                $title = $booking->vehicle->vehicle_number;

                return [
                    "uuid"       => $job->uuid,
                    "vehicle_photo"       => $vehiclePhoto,
                    "booking_id"          => $bookingId,
                    "booking_created_at"  => $bookingCreatedAt,
                    "total_service_price" => $totalServicePrice,
                    "title"               => $title,
                ];
            });

            return response()->json([
                'status'  => true,
                'message' => "Jobs requests fetched",
                'list'    => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Update Job Status
     * @param Request $request
     * @param string $uuid Job UUID
     * @return mixed
     */
    public function updateStatus(Request $request, $uuid)
    {
        try {
            $user = $request->user();
            $job = MechanicJob::whereUuid($uuid)->first();

            if (!$job) {
                return response()->json(['status' => false, 'message' => 'Job not found'], 404);
            }

            $booking = Booking::find($job->booking_id);
            if (!$booking) {
                return response()->json(['status' => false, 'message' => 'Job booking not found'], 404);
            }

            $validated = $request->validate([
                'status' => 'required|in:pending,accepted,rejected,completed',
                'rejection_reason' => $request->status === 'rejected' ? 'required' : 'nullable'
            ]);

            $job->update([
                'status' => $validated['status'],
                'rejection_reason' => $validated['rejection_reason'] ?? null
            ]);

            $booking->update(
                $validated['status'] === 'accepted'
                    ? [
                        'mechanic_id' => $user->id,
                        'booking_status' => 'accepted',
                        'assigned_date' => now()
                    ]
                    : ['booking_status' => $validated['status']]
            );

            $msg = "mechanic job status updated as - " . $job->status;
            activityLog($user, "mechanic jobs status updated", $msg);

            return response()->json([
                'status' => true,
                'message' => "Job status updated as {$validated['status']}",
            ]);
        } catch (Exception $e) {
            $msg = "error in mechanic job status updation - " . $e->getMessage();
            activityLog($request->user(), "error in mechanic job status updation", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Fetch Booking Details
     * @param Request $request
     * @return mixed
     */
    public function fetchBookingDetails(Request $request)
    {
        try {
            $job = MechanicJob::with([
                'booking',
                'booking.services.service_type',
                'booking.vehicle.vehicle_photos'
            ])->where('uuid', $request->job_uuid)->first();

            if (!$job) {
                return response()->json([
                    'status'  => false,
                    'message' => "Job does not exist",
                ], 404);
            }

            $booking = $job->booking;

            // Format dates
            $requestedOn = Carbon::parse($booking->created_at)->format('D, d M · h:i A');
            $deliveryDate = $booking->delivery_date ? Carbon::parse($booking->delivery_date)->format('D, d M · h:i A') : null;

            // Merge service names
            $serviceNames = $booking->services->map(function ($service) {
                return $service->service_type->name ?? null;
            })->filter()->values();

            // Estimated price calculation
            $serviceDetails = [];
            $total = 0;

            foreach ($booking->services as $service) {
                $price = $service->service_type->base_price ?? 0;
                $total += $price;

                $serviceDetails[] = [
                    "name"  => $service->service_type->name,
                    "price" => $price,
                ];
            }

            $pickupPrice = 0;
            $total += $pickupPrice;

            return response()->json([
                "status" => true,
                "message" => "Service details fetched",
                "data" => [
                    "requested_on" => $requestedOn,
                    "delivery_datetime" => $deliveryDate,

                    "service_summary" => $serviceNames->join(', '),

                    "customer_note" => $booking->additional_note,

                    "estimated_price_section" => [
                        "services" => $serviceDetails,
                        "pickup_service" => [
                            "name" => "Pickup Service",
                            "price" => $pickupPrice,
                        ],

                        "total_estimation" => $total,
                    ],
                ]

            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
