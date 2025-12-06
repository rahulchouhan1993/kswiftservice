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

            $msg = "mechanic jobs list fetched";
            activityLog($user, "mechanic jobs list fetched", $msg);

            return response()->json([
                'status'  => true,
                'message' => "Jobs requests fetched",
                'list'    => $data
            ], 200);
        } catch (Exception $e) {
            $msg = "error in fetch mechanic jobs list - " . $e->getMessage();
            activityLog($request->user(), "error in fetch mechanic jobs list", $msg);

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
}
