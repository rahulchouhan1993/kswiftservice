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
                'booking.customer',
                'booking.mechanic',
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
                    "customer"            => $booking->customer,
                    "mechanic"            => $booking->mechanic
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
                'mechanic',
                'booking.customer',
                'booking.services',
                'booking.services.service_type',
                'booking.vehicle',
                'booking.payment',
            ])->where('uuid', $request->job_uuid)->first();

            if (!$job) {
                return response()->json([
                    'status'  => false,
                    'message' => "Job does not exist",
                ], 404);
            }

            $booking = $job->booking;
            $customer = $booking->customer;

            // Format service list
            $serviceTotalAmount = 0;
            $services = $booking->services->map(function ($service) use (&$serviceTotalAmount) {
                $serviceTotalAmount += $service->service_type->base_price ?? 0;

                return [
                    "service_id"     => $service->id,
                    "service_name"   => $service->service_type->name ?? null,
                    "service_price"  => $service->service_type->base_price ?? null,
                    "photo_url"      => $service->photo_url,
                    "video_url"      => $service->video_url,
                ];
            });

            return response()->json([
                "status"  => true,
                "message" => "Booking details fetched successfully",
                "data"    => [
                    "booking_id"       => $booking->booking_id,
                    "vehicle_number"   => $booking->vehicle->vehicle_number,
                    "booking_date" => Carbon::parse($booking->date)->format('D, d M'),
                    "assigned_date" => Carbon::parse($booking->assigned_date)->format('D, d M · h:i A'),
                    "requested_on"  => Carbon::parse($job->created_at)->format('D, d M · h:i A'),
                    "additional_note"  => $booking->additional_note,

                    "customer" => [
                        "id"   => $customer->id,
                        "name" => $customer->name ?? null,
                    ],
                    "mechanic" => [
                        "id"   => $job->mechanic->id ?? null,
                        "name" => $job->mechanic->name ?? null,
                    ],

                    "services" => $services,
                    "service_total" => $services->sum('service_price'),
                    "payment" => [
                        "id"   => $booking->payment->id,
                        "txnId" => $booking->payment->txnId,
                        "amount" => $booking->payment->amount,
                        "payment_mode" => $booking->payment->payment_mode,
                        "status" => $booking->payment->status,
                        "invoice_url" => $booking->payment->invoice_url,
                        "received_at" => $booking->payment->received_at,
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
