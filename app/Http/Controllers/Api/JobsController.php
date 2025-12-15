<?php

namespace App\Http\Controllers\Api;

use App\FacebookApi;
use App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\MechanicJob;
use App\Models\Notification;
use App\PushNotification;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\Console\Helper\Helper;

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
            if (!in_array($status, ['pending', 'accepted', 'rejected', 'completed'])) {
                return response()->json([
                    'status'  => false,
                    'message' => "Status can be [pending, accepted, rejected, completed]"
                ], 500);
            }


            $jobs = MechanicJob::with([
                'booking',
                'booking.payment',
                'booking.customer',
                'mechanic',
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
                    "mechanic"            => $job->mechanic,
                    "payment"            => $job->booking->payment
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

            $booking = Booking::with(['customer'])->find($job->booking_id);
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

            if (env("CAN_SEND_MESSAGE") && $request->status == 'accepted' || $request->status == 'completed') {
                if ($request->status == 'accepted') {
                    $templateName = "msg_to_customer_on_adnavce_payment";
                    $data = [
                        $booking->customer->name,
                        Helpers::toRupeeCurrency(1000)
                    ];
                } elseif ($request->status == 'completed') {
                    $templateName = "msg_to_customer_on_service_complete";
                    $data = [
                        $booking->customer->name,
                    ];
                }
                $lang = "en";
                $phone = $booking->customer->phone;

                $perameters = generateParameters($data);
                $msgData = createMessageData($phone, $templateName, $lang, $perameters);
                $fb = new FacebookApi();
                $resp = $fb->sendMessage($msgData);
                createMessageHistory($templateName, $user, $phone, $resp);
            }

            if (env("CAN_SEND_PUSH_NOTIFICATIONS") && $request->status == 'accepted' || $request->status == 'completed') {
                $deviceToken = $booking->customer->fcm_token->token;
                if ($deviceToken) {
                    if ($request->status == 'accepted') {
                        $temp = getNotificationTemplate('advance_payment');
                        $uData = [
                            'CUSTOMER_NAME' => $booking->customer->name,
                            'AMOUNT' => Helpers::toRupeeCurrency(1000)
                        ];
                    } elseif ($request->status == 'completed') {
                        $temp = getNotificationTemplate('service_completed');
                        $uData = [
                            'CUSTOMER_NAME' => $booking->customer->name,
                        ];
                    }
                    $tempWData = parseNotificationTemplate($temp, $uData);
                    $data = [
                        'key1' => 'value1',
                        'key2' => 'value2',
                    ];
                    $resp = $this->sendPushNotification($deviceToken, $tempWData, $data);
                    if (!empty($resp) && $resp['name']) {
                        Notification::create([
                            'user_id' => $booking->customer->id,
                            'type' => 'push',
                            'data' => json_encode($tempWData, JSON_UNESCAPED_UNICODE),
                        ]);
                    }
                }
            }

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
                'booking.customer',
                'booking.services.service_type',
                'booking.vehicle',
                'booking.payment',
                'mechanic',
            ])->where('uuid', $request->job_uuid)->first();

            if (!$job || !$job->booking) {
                return response()->json([
                    'status'  => false,
                    'message' => "Job or booking does not exist",
                ], 404);
            }

            $booking  = $job->booking;
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

            return response()->json([
                "status"  => true,
                "message" => "Booking details fetched successfully",
                "data"    => [
                    "id"     => $booking->id,
                    "uuid"     => $booking->uuid,
                    "booking_id"     => $booking->booking_id,
                    "vehicle_number" => optional($booking->vehicle)->vehicle_number,

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

                    "payment" => $payment ? [
                        "id"            => $payment->id,
                        "txnId"         => $payment->txnId,
                        "amount"        => $payment->amount,
                        "payment_mode"  => $payment->payment_mode,
                        "status"        => $payment->status,
                        "invoice_url"   => $payment->invoice_url,
                        "received_at"   => $payment->received_at,
                    ] : null,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
