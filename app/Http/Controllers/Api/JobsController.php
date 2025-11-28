<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\MechanicJob;
use Exception;
use Illuminate\Http\Request;

class JobsController extends Controller
{
    /**
     * Fetch Jobs Request List
     * @param Request $request
     * @return mixed
     */
    public function fetchJobsRequestList(Request $request)
    {
        try {
            $user = $request->user();

            $jobs = MechanicJob::with([
                'booking',
                'booking.services.service_type',
                'booking.vehicle.vehicle_photos'
            ])
                ->whereStatus('pending')
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
            $job = MechanicJob::where('uuid', $uuid)->first();

            if (!$job) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Job not found',
                ], 404);
            }

            $booking = Booking::find($job->booking_id);
            if (!$booking) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Job booking not found',
                ], 404);
            }

            $request->validate([
                'status' => 'required|in:pending,accepted,rejected'
            ]);

            $job->update([
                'status' => $request->status
            ]);

            if ($job->status == 'accepted') {
                $booking->update([
                    'mechanic_id' => $user->id
                ]);
            }

            return response()->json([
                'status'  => true,
                'message' => "Job status updated as " . $request->status,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
