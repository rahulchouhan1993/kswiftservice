<?php

namespace App\Http\Controllers\Api;

use App\FacebookApi;
use App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\MechanicJob;
use App\Models\Notification;
use App\Models\User;
use App\Models\UserChat;
use App\PushNotification;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\Console\Helper\Helper;
use Throwable;

use function App\activityLog;
use function App\createMessageData;
use function App\createMessageHistory;
use function App\generateParameters;
use function App\getNotificationTemplate;
use function App\parseNotificationTemplate;

class JobsController extends Controller
{
    use PushNotification;
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

            if (!in_array($status, ['all', 'pending', 'accepted', 'rejected', 'completed'])) {
                return response()->json([
                    'status'  => false,
                    'message' => "Status can be [all, pending, accepted, rejected, completed]"
                ], 422);
            }

            $jobsQuery = MechanicJob::with([
                'booking',
                'booking.payment',
                'booking.customer',
                'mechanic',
                'booking.services.service_type',
                'booking.vehicle.vehicle_photos'
            ])
                ->whereUserId($user->id)
                ->orderBy('created_at', 'DESC');


            if ($status !== 'all') {
                $jobsQuery->whereStatus($status);
            }

            $jobs = $jobsQuery->get();

            $data = $jobs->map(function ($job) {
                $booking = $job->booking;
                $review = $booking->review ? [
                    'review' => $booking->review->review,
                    'feedback' => $booking->review->feedback,
                ] : null;

                $mechanic_review = $booking->mechanic ? $booking->mechanic->mechanic_reviews : null;
                $bookingUnreadMsgCount = UserChat::whereBookingId($booking->id)
                    ->whereReceiverRole('mechanic')
                    ->whereNull('read_time')
                    ->count();

                return [
                    "uuid"       => $booking->uuid,
                    "job_uuid" => $job->uuid,
                    "vehicle_photo" => optional(
                        $booking->vehicle->vehicle_photos->first()
                    )->photo_url,

                    "booking_id"          => $booking->booking_id,
                    "booking_created_at"  => $booking->created_at->format('d M Y'),
                    "booking_status"      => $booking->booking_status,
                    "job_status"      => $job->status,
                    "rejected_date"       => $job->rejected_at,

                    "total_service_price" => $booking->services->sum(
                        fn($service) => $service->service_type->base_price ?? 0
                    ),

                    "title"    => $booking->vehicle->vehicle_number,
                    "customer" => $booking->customer,
                    "mechanic" => $job->mechanic,


                    'review' => $review,
                    'mechanic_review' => $mechanic_review,
                    'booking_unread_msg_count' => $bookingUnreadMsgCount,

                    "payment" => (
                        $booking->payment &&
                        $booking->payment->status === 'success'
                    ) ? $booking->payment : null,
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
                return response()->json([
                    'status' => false,
                    'message' => 'Job not found'
                ], 404);
            }

            $booking = Booking::with(['customer', 'garage'])->find($job->booking_id);
            if (!$booking) {
                return response()->json([
                    'status' => false,
                    'message' => 'Job booking not found'
                ], 404);
            }

            $validated = $request->validate([
                'status' => 'required|in:pending,accepted,rejected,completed',
                'rejection_reason' => 'nullable|string',
            ]);

            if ($validated['status'] === 'rejected' && empty($validated['rejection_reason'])) {
                return response()->json([
                    'status' => false,
                    'message' => 'Rejection reason is required'
                ], 422);
            }

            $job->update([
                'status'           => $validated['status'],
                'rejection_reason' => $validated['status'] === 'rejected' ? $validated['rejection_reason'] : null,
                'rejection_time'   => $validated['status'] === 'rejected' ? Carbon::now() : null,
            ]);

            switch ($validated['status']) {
                case 'accepted':
                    $booking->update([
                        'mechanic_id'   => $user->id,
                        'booking_status' => 'awaiting_payment',
                        'assigned_date' => Carbon::now(),
                    ]);
                    break;

                case 'rejected':
                    $booking->update([
                        'booking_status' => 'pending',
                        'garage_id'      => null,
                    ]);
                    break;

                default:
                    $booking->update([
                        'booking_status' => $validated['status'],
                    ]);
            }

            activityLog(
                $user,
                $validated['status'] === 'rejected' ? "mechanic rejected booking {$booking->booking_id}" : "mechanic job status updated",
                $validated['status'] === 'rejected' ? "mechanic rejected booking - {$booking->booking_id}" : "status updated as {$validated['status']}"
            );

            if (env('CAN_SEND_MESSAGE') && in_array($validated['status'], ['accepted', 'completed'])) {
                $templateName = null;
                $params = [];

                if ($validated['status'] === 'accepted') {
                    $templateName = 'msg_to_customer_on_adnavce_payment';
                    $params = [
                        $booking->customer->name,
                        Helpers::toRupeeCurrency(1000),
                    ];
                }

                if ($validated['status'] === 'completed') {
                    $templateName = 'msg_to_customer_on_service_complete';
                    $params = [
                        $booking->customer->name,
                    ];
                }

                if ($templateName) {
                    $msgData = createMessageData(
                        $booking->customer->phone,
                        $templateName,
                        'en',
                        generateParameters($params)
                    );

                    $fb = new FacebookApi();
                    $resp = $fb->sendMessage($msgData);

                    createMessageHistory($templateName, $user, $booking->customer->phone, $resp);
                }
            }

            if (env('CAN_SEND_MESSAGE') && $validated['status'] === 'rejected') {
                $msgData = createMessageData(
                    env('ADMIN_PHONE'),
                    'msg_to_admin_on_job_decline_by_admin',
                    'en',
                    generateParameters([
                        $booking->booking_id,
                        $booking->customer->name,
                        $user->name,
                        optional($booking->garage)->name,
                    ])
                );

                $fb = new FacebookApi();
                $resp = $fb->sendMessage($msgData);
                createMessageHistory('msg_to_admin_on_job_decline_by_admin', $user, env('ADMIN_PHONE'), $resp);
            }

            $fcmToken =
                optional(optional($booking->customer)->fcm_token)->token
                ?? $booking->customer->fcm_token
                ?? null;

            if (env('CAN_SEND_PUSH_NOTIFICATIONS') && in_array($validated['status'], ['accepted', 'completed']) && $fcmToken) {
                if ($validated['status'] === 'accepted') {
                    $template = getNotificationTemplate('advance_payment');
                    $payload = parseNotificationTemplate($template, [
                        'CUSTOMER_NAME' => $booking->customer->name,
                        'AMOUNT'        => Helpers::toRupeeCurrency(1000),
                    ]);

                    $data = [
                        'type'          => 'advance_payment',
                        'booking_uuid'  => (string) $booking->uuid,
                        'job_uuid'  => (string) $job->uuid,
                        'hasReview'     => $booking->review ? '1' : '0',
                        'msg_type' => 'booking'
                    ];
                } else {
                    $template = getNotificationTemplate('service_completed');
                    $payload = parseNotificationTemplate($template, [
                        'CUSTOMER_NAME' => $booking->customer->name,
                    ]);
                    $data = [
                        'type'          => 'service_completed',
                        'booking_uuid'  => (string) $booking->uuid,
                        'job_uuid'  => (string) $job->uuid,
                        'hasReview'     => $booking->review ? '1' : '0',
                        'msg_type' => 'booking'
                    ];
                }

                $resp = $this->sendPushNotification($fcmToken, $payload, $data);

                if (!empty($resp['name'])) {
                    Notification::create([
                        'user_id' => $booking->customer->id,
                        'type'    => 'push',
                        'data'    => json_encode($payload, JSON_UNESCAPED_UNICODE),
                    ]);
                }
            }

            return response()->json([
                'status'  => true,
                'message' => "Job status updated as {$validated['status']}",
            ]);
        } catch (Throwable $e) {
            activityLog($request->user(), 'error in mechanic job status update', $e->getMessage());

            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong. Please try again.',
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
                'booking.customer',
                'booking.services.service_type',
                'booking.vehicle',
                'booking.vehicle.vehile_make',
                'booking.payment',
                'mechanic',
            ])->where('uuid', $request->job_uuid)->first();

            if (!$job) {
                return response()->json([
                    'status'  => false,
                    'message' => "Job does not exist",
                ], 404);
            }

            $booking  = $job->booking;
            if (!$booking) {
                return response()->json([
                    'status'  => false,
                    'message' => "Booking does not exist in this job",
                ], 404);
            }
            $customer = $booking->customer;
            $payment  = $booking->payment;

            // Services
            $services = $booking->services->map(function ($service) {
                return [
                    "service_id"    => $service->id,
                    "service_name"  => optional($service->service_type)->name,
                    "service_price" => optional($service->service_type)->base_price ?? 0,
                    "photo_url"     => $service->photo_url,
                    "video_url"     => $service->video_url,
                    "note"          => $service->note,
                ];
            });

            $review = $booking->review ? [
                'review' => $booking->review->review,
                'feedback' => $booking->review->feedback,
            ] : null;

            $mechanic_review = $booking->mechanic ? $booking->mechanic->mechanic_reviews : null;


            return response()->json([
                "status"  => true,
                "message" => "Booking details fetched successfully",
                "data"    => [
                    "id"     => $booking->id,
                    "uuid"     => $job->uuid,
                    "booking_uuid"     => $booking->uuid,
                    "booking_id"     => $booking->booking_id,
                    "booking_status"     => $booking->booking_status,
                    "job_status"     => $job->status,
                    "cancellation_reason" => $job->cancellation_reason,
                    "cancel_date" => $job->cancel_date ? Carbon::parse($job->cancel_date)->format('D, d M · h:i A') : null,
                    "rejection_reason" => $job->rejection_reason,
                    "rejection_time" => $job->rejection_time ? Carbon::parse($job->rejection_time)->format('D, d M · h:i A') : null,
                    "delivery_date"     => $booking->delivery_date,
                    "vehicle_number" => optional($booking->vehicle)->vehicle_number,
                    "vehicle_model" => optional($booking->vehicle)->model ?? null,
                    "vehicle_make" => optional($booking->vehicle->vehile_make)->name ?? null,

                    "booking_date"   => $booking->date
                        ? Carbon::parse($booking->date)->format('D, d M')
                        : null,

                    "assigned_date"  => $booking->assigned_date
                        ? Carbon::parse($booking->assigned_date)->format('D, d M · h:i A')
                        : null,

                    "requested_on"   => Carbon::parse($job->created_at)->format('D, d M · h:i A'),
                    "additional_note" => $booking->additional_note,
                    "customer" => [
                        "id"   => optional($customer)->id,
                        "name" => optional($customer)->name,
                    ],

                    "mechanic" => [
                        "id"   => optional($job->mechanic)->id,
                        "name" => optional($job->mechanic)->name,
                    ],

                    "services"       => $services,
                    "service_total"  => $services->sum('service_price'),

                    "payment" => ($payment && $payment->status == 'success') ? [
                        "id"            => $payment->id,
                        "txnId"         => $payment->txnId,
                        "amount"        => $payment->amount,
                        "payment_mode"  => $payment->payment_mode,
                        "status"        => $payment->status,
                        "invoice_url"   => $payment->invoice_url,
                        "received_at"   => $payment->received_at,
                    ] : null,

                    'review' => $review,
                    'mechanic_review' => $mechanic_review,
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
