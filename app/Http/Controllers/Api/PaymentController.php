<?php

namespace App\Http\Controllers\Api;

use App\FacebookApi;
use App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\MechanicEarning;
use App\Models\Notification;
use App\Models\Payment;
use App\PushNotification;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

use function App\activityLog;
use function App\createMessageData;
use function App\createMessageHistory;
use function App\generateParameters;
use function App\getNotificationTemplate;
use function App\parseNotificationTemplate;

class PaymentController extends Controller
{
    use PushNotification;
    /**
     * Sumit Payment Details
     * @param Request $request
     * @return mixed
     */
    public function submitPaymentDetails(Request $request)
    {
        try {
            $request->validate([
                'booking_id' => ['required', 'integer'],
                'txnId' => ['required', 'string'],
                'status' => ['required', 'string'],
                'amount' => ['required'],
                'payment_mode' => ['required'],
            ]);

            $user = $request->user();
            $booking = Booking::find($request->booking_id);

            if (!$booking) {
                return response()->json([
                    'status' => false,
                    'message' => "Booking does not exist",
                ], 500);
            }

            $invoiceNo = Helpers::shortUuid();
            $payment = Payment::create([
                'user_id'       => $user->id,
                'booking_id'    => $booking->id,
                'txnId'         => $request->txnId,
                'payment_mode'  => $request->payment_mode,
                'amount'        => $request->amount,
                'status'        => $request->status,
                'invoice_no' => $invoiceNo,
            ]);

            $mechanicAmount = round($payment->amount * 0.20, 2);
            MechanicEarning::create([
                'user_id'      => $payment->user_id,
                'mechanic_id'  => $booking->mechanic_id,
                'booking_id'   => $payment->booking_id,
                'amount'       => $mechanicAmount,
            ]);

            $payment->load([
                'user',
                'user.default_address',
                'user.default_address.state',
                'user.default_address.city',
                'booking',
                'booking.mechanic',
                'booking.services',
                'booking.services.service_type',
                'booking.vehicle',
                'booking.vehicle.vehile_make',
            ]);

            $pdf = Pdf::loadView('pdf.invoice', compact('payment'))
                ->setPaper('A4', 'portrait')
                ->setOption('isRemoteEnabled', true)
                ->setOption('isHtml5ParserEnabled', true)
                ->setOption('isFontSubsettingEnabled', true);

            $fileName = 'invoice_' . $invoiceNo . '.pdf';
            $filePath = 'invoices/' . $fileName;
            Storage::disk('public')->put($filePath, $pdf->output());

            $payment->update([
                'invoice_path' => $fileName,
            ]);

            $msg = "payment done by " . $user->name;
            activityLog($user, "payment done", $msg);

            if (env("CAN_SEND_MESSAGE")) {
                $templateName = "msg_to_customer_on_payment_success";
                $lang = "en";
                $phone = $user->phone;
                $data = [
                    $booking->booking_id,
                    $payment->booking->mechanic->name ?? '--',
                    $payment->booking->mechanic->phone ?? '--',
                ];
                $btnData = [
                    [
                        'sub_type' => 'url',
                        'index'    => 0,
                        'value'    => "storage/invoices/" . $payment->invoice_path
                    ]
                ];

                $perameters = generateParameters($data);
                $msgData = createMessageData($phone, $templateName, $lang, $perameters, $btnData);
                $fb = new FacebookApi();
                $resp = $fb->sendMessage($msgData);
                createMessageHistory($templateName, $user, $phone, $resp);
            }

            if (env("CAN_SEND_PUSH_NOTIFICATIONS")) {
                $deviceToken = $user->fcm_token->token;
                if ($deviceToken) {
                    $temp = getNotificationTemplate('payment_successful');
                    $uData = [
                        'BOOKING_ID' => $booking->booking_id,
                    ];
                    $tempWData = parseNotificationTemplate($temp, $uData);
                    $data = [
                        'key1' => 'value1',
                        'key2' => 'value2',
                    ];
                    $resp = $this->sendPushNotification($deviceToken, $tempWData, $data);
                    if (!empty($resp) && $resp['name']) {
                        Notification::create([
                            'user_id' => $user->id,
                            'type' => 'push',
                            'data' => json_encode($tempWData, JSON_UNESCAPED_UNICODE),
                        ]);
                    }
                }
            }

            return response()->json([
                'status'  => true,
                'message' => "Booking payment successful",
                'payment' => $payment
            ], 201);
        } catch (Exception $e) {
            $msg = "error in submit payment details - " . $e->getMessage();
            activityLog($request->user(), "error in submit payment details", $msg);

            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }




    /**
     * Fetch Payment Invoices & Receipts
     * @return mixed
     */
    public function paymentInvoicesAndReceipts(Request $request)
    {
        try {
            $user = $request->user();

            $bookings = Booking::with([
                'payment',
                'vehicle',
                'vehicle.vehicle_photos',
                'vehicle.vehile_make',
                'mechanic_earning'
            ])
                // 🔐 Role based filter
                ->when($user->role === 'customer', function ($query) use ($user) {
                    $query->whereUserId($user->id);
                })
                ->when($user->role === 'mechanic', function ($query) use ($user) {
                    $query->whereMechanicId($user->id);
                })

                // 📅 Date range filter
                ->when($request->filled('date_range'), function ($query) use ($request) {
                    [$start, $end] = explode('-', $request->date_range);

                    $startDate = Carbon::createFromFormat('d/m/Y', trim($start))->startOfDay();
                    $endDate   = Carbon::createFromFormat('d/m/Y', trim($end))->endOfDay();

                    $query->whereBetween('created_at', [$startDate, $endDate]);
                })

                // 🧾 Booking ID filter
                ->when($request->filled('booking_id'), function ($query) use ($request) {
                    $query->where('booking_id', $request->booking_id);
                })

                // 🚗 Vehicle type filter (car / bike)
                ->when($request->filled('vehicle_type'), function ($query) use ($request) {
                    $query->whereHas('vehicle', function ($q) use ($request) {
                        $q->where('vehicle_type', $request->vehicle_type);
                    });
                })

                // ⬆⬇ Sort filter
                ->orderBy(
                    'created_at',
                    in_array($request->sort_by, ['asc', 'desc']) ? $request->sort_by : 'desc'
                )

                ->get()
                ->map(function ($booking) {

                    $vehicle = $booking->vehicle;
                    $payment = $booking->payment;

                    if (!$vehicle || !$payment) {
                        return null;
                    }

                    $vehiclePhotos = $vehicle->vehicle_photos->map(function ($photo) {
                        return [
                            'id'        => $photo->id,
                            'photo_url' => $photo->photo_url,
                        ];
                    });

                    $mechanicEarning = $booking->mechanic_earning
                        ? [
                            'amount' => $booking->mechanic_earning->amount
                        ]
                        : null;

                    return [
                        'booking_id'     => $booking->booking_id,
                        'vehicle_number' => $vehicle->vehicle_number ?? null,
                        'title'          => ($vehicle->vehicle_number ?? '-') . ' - ' . $booking->booking_id,
                        'vehicle_make'   => $vehicle->vehile_make->name ?? null,
                        'vehicle_model'  => $vehicle->model ?? null,
                        'booking_date'   => Carbon::parse($booking->created_at)->format('d M Y'),
                        'amount'         => $payment->amount ?? null,
                        'payment_mode'   => $payment->payment_mode ?? null,
                        'invoice_path'   => $payment->invoice_url ?? null,
                        'vehicle_photos' => $vehiclePhotos,
                        'mechanic_earning' => $mechanicEarning
                    ];
                })
                ->filter()
                ->values();

            return response()->json([
                "status" => true,
                "data"   => $bookings,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }




    /**
     * Fetch Transaction History
     * @return mixed
     */
    public function transactionHistory(Request $request)
    {
        try {
            $user = $request->user();
            $payments = Payment::with([
                'booking',
                'booking.vehicle',
                'booking.vehicle.vehile_make'
            ])
                ->whereUserId($user->id)
                ->latest()
                ->get()
                ->map(function ($payment) {
                    $booking = $payment->booking;
                    $vehicle = $booking->vehicle;
                    return [
                        'txn_id'     => $payment->txnId,
                        'status'     => $payment->status,
                        'amount'     => trim(Helpers::toRupeeCurrency($payment->amount)),
                        'txn_date'     => Carbon::parse($payment->created_at)->format('d M Y'),
                        'invoice_no'     => $payment->invoice_no,
                        'invoice_url'     => $payment->invoice_url,
                    ];
                });

            return response()->json([
                "status" => true,
                "data"   => $payments,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
