<?php

namespace App\Http\Controllers\Api;

use App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
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

            // Create payment
            $payment = Payment::create([
                'user_id'       => $user->id,
                'booking_id'    => $booking->id,
                'txnId'         => $request->txnId,
                'payment_mode'  => $request->payment_mode,
                'amount'        => $request->amount,
                'status'        => $request->status,
            ]);

            // Load relations
            $payment->load([
                'booking',
                'booking.services',
                'booking.services.service_type',
                'booking.vehicle',
                'booking.vehicle.vehile_make',
            ]);

            // -----------------------------------------------------------
            //  GENERATE INVOICE PDF
            // -----------------------------------------------------------
            $pdf = Pdf::loadView('pdf.invoice', compact('payment'))
                ->setPaper('A4', 'portrait')
                ->setOption('isRemoteEnabled', true)
                ->setOption('isHtml5ParserEnabled', true)
                ->setOption('isFontSubsettingEnabled', true);

            $fileName = 'invoice_' . $payment->uuid . '.pdf';
            $filePath = 'invoices/' . $fileName;

            // Save PDF to storage
            Storage::disk('public')->put($filePath, $pdf->output());

            // Store link in DB
            $payment->update([
                'invoice_url' => asset('storage/' . $filePath)
            ]);

            return response()->json([
                'status'  => true,
                'message' => "Booking payment successful",
                'payment' => $payment
            ], 201);
        } catch (Exception $e) {

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
                        'booking_id'       => $booking->booking_id,
                        'vehicle_number'   => $vehicle->vehicle_number,
                        'title'            => $vehicle->vehicle_number . ' - ' . $booking->booking_id,
                        'vehicle_make'     => $vehicle->vehile_make->name ?? null,
                        'vehicle_model'    => $vehicle->model,
                        'booking_date'     => Carbon::parse($booking->created_at)->format('d M Y'),
                        'payment_mode'     => $payment->payment_mode,
                        'invoice_path'     => $payment->invoice_url,
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
