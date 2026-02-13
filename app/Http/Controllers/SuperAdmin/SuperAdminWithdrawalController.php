<?php

namespace App\Http\Controllers\SuperAdmin;

use App\FacebookApi;
use App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\WalletTransition;
use App\Models\WithdrawalRequest;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

use function App\createMessageData;
use function App\createMessageHistory;
use function App\generateParameters;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class SuperAdminWithdrawalController extends Controller
{
    /**
     * Get Withdrawal Requests
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
    */
    public function getWithdrawalRequests(Request $request)
    {
        try {
            $start_date = $request->query('start_date');
            $end_date   = $request->query('end_date');
            $search     = $request->query('search');
            $status     = $request->query('status');

            $withdrawalRequests = WithdrawalRequest::with('mechanic')
                ->latest()
                ->when($start_date || $end_date, function ($q) use ($start_date, $end_date) {
                    if ($start_date) {
                        $q->whereDate('created_at', '>=', Carbon::parse($start_date)->startOfDay());
                    }

                    if ($end_date) {
                        $q->whereDate('created_at', '<=', Carbon::parse($end_date)->endOfDay());
                    }
                })
                ->when($search, function ($q) use ($search) {
                    $q->where(function ($query) use ($search) {
                        $query->where('amount', 'LIKE', "%{$search}%")
                            ->orWhereHas('mechanic', function ($mq) use ($search) {
                                $mq->where('name', 'LIKE', "%{$search}%")
                                ->orWhere('phone', 'LIKE', "%{$search}%")
                                ->orWhere('email', 'LIKE', "%{$search}%");
                            });
                    });
                })
                ->when($status, fn ($q) => $q->where('status', $status))
                ->paginate($this->per_page ?? 50)
                ->withQueryString();

            return Inertia::render('SuperAdmin/Payments/WalletWithdrawals', [
                'list'       => $withdrawalRequests,
                'status'     => $status,
                'search'     => $search,
                'start_date' => $start_date,
                'end_date'   => $end_date,
            ]);

        } catch (Exception $e) {
            abort(500, 'Something went wrong while fetching withdrawal requests.');
        }
    }


    /**
     * Update Withdrawal Request Status
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
    */
    public function updateStatus(Request $request)
    {
        try{
            $status = $request->status;
            $note = $request->note;
            $rejection_reason = $request->rejection_reason;
            $astimated_payment_date = $request->astimated_payment_date;

            $request->validate([
                'uuid' => ['required', 'string'],
                'status' => ['required', Rule::in(['in_process', 'rejected', 'completed'])],
                'note' =>  ['nullable', 'string'],

                'rejection_reason' => [
                    Rule::requiredIf($status === 'rejected')
                ],

                'astimated_payment_date' => [
                    Rule::requiredIf($status === 'in_process')
                ],
            ]);

            $withdrawalRequest = WithdrawalRequest::with(['mechanic'])->where('uuid', $request->uuid)->first();
            if(!$withdrawalRequest){
                return back()->with('error', "Withdrawal request not found");
            }

            $withdrawalRequest->update([
                'status' => $status,
                'admin_note' => $note,
                'rejection_reason' => $status === 'rejected' ? $rejection_reason : null,
                'astimated_transfer_time' => $status === 'in_process' ? Carbon::parse($astimated_payment_date) : null,
            ]);

            $mechanic = $withdrawalRequest->mechanic;
            if($status === 'completed'){
                $mechanic->update([
                    'balence' => $mechanic->balence - $withdrawalRequest->amount,
                ]);

                $invoiceNo = Helpers::shortUuid();
                $pdf = Pdf::loadView('pdf.wallet_transition_invoice', [
                    'withdrawalRequest' => $withdrawalRequest,
                    'txn_type' => 'debit',
                    'invoice_no' => $invoiceNo,
                    'current_balance' => $mechanic->balence,
                ])
                ->setPaper('A4', 'portrait')
                ->setOption('isRemoteEnabled', true)
                ->setOption('isHtml5ParserEnabled', true)
                ->setOption('isFontSubsettingEnabled', true);

                $fileName = 'invoice_' . $invoiceNo . '.pdf';
                $filePath = 'invoices/' . $fileName;
                Storage::disk('public')->put($filePath, $pdf->output());

                $withdrawalRequest->update([
                    'invoice_path' => $fileName,
                ]);

                WalletTransition::create([
                    'user_id' => $mechanic->id,
                    'amount' => $withdrawalRequest->amount,
                    'txn_type' => 'debit',
                    'current_balance' => $mechanic->balence - $withdrawalRequest->amount,
                    'invoice_path' => $fileName,
                ]);
            }

            if (env("CAN_SEND_MESSAGE")) {
                $lang         = "en";
                $phone        = $mechanic->phone;
                if($status === 'in_process'){
                    $templateName = "msg_to_mechanic_on_accept_withdrawal_request";
                    $data = [
                        $mechanic->name ?? '--',
                        $astimated_payment_date ? Carbon::parse($astimated_payment_date)->format('d M Y') : '--',
                    ];
                }elseif($status === 'rejected'){
                    $templateName = "msg_to_mechanic_on_reject_his_withdrawal_request";
                    $data = [
                        $mechanic->name ?? '--',
                        $rejection_reason ?? '--',
                    ];
                }elseif($status === 'completed'){
                    $templateName = "msg_to_mechanic_on_withdwral_request_complete";
                    $data = [
                        $mechanic->name ?? '--',
                        Helpers::toRupeeCurrency($withdrawalRequest->amount) ?? '--',
                    ];
                }

                $parameters = generateParameters($data);
                $msgData = createMessageData($phone, $templateName, $lang, $parameters);

                $fb   = new FacebookApi();
                $resp = $fb->sendMessage($msgData);
                createMessageHistory($templateName, $mechanic, $phone, $resp);
            }

            return back()->with('success', 'Withdrawal request ' . $status . ' successfully');
        }catch(Exception $e){
            return back()->with('error', $e->getMessage());
        }
    }
}
