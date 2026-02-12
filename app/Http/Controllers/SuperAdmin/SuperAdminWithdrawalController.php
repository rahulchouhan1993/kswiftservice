<?php

namespace App\Http\Controllers\SuperAdmin;

use App\FacebookApi;
use App\Helpers;
use App\Http\Controllers\Controller;
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
        try{
            $search      = $request->query('search');
            $status      = $request->query('status');

            $withdrawalRequests = WithdrawalRequest::with([
                'mechanic'
            ])->orderBy('created_at', 'DESC')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->orWhere('amount', 'LIKE', "%{$search}%");
                })
                ->orWhereHas('mechanic', function($q) use ($search){
                    $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
                });
            })
            ->when($status, function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->paginate($this->per_page ?? 50)
            ->withQueryString();

            return Inertia::render('SuperAdmin/Payments/WalletWithdrawals', [
                'list' => $withdrawalRequests,
                'status' => $status,
                'search' => $search
            ]);
        }catch(Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
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
                'status' => ['required', Rule::in(['accept', 'reject'])],
                'note' => [
                    Rule::requiredIf($status === 'accept')
                ],

                'rejection_reason' => [
                    Rule::requiredIf($status === 'reject')
                ],

                'astimated_payment_date' => [
                    Rule::requiredIf($status === 'accept')
                ],
            ]);

            $withdrawalRequest = WithdrawalRequest::where('uuid', $request->uuid)->first();
            if(!$withdrawalRequest){
                return back()->with('error', "Withdrawal request not found");
            }

            $withdrawalRequest->update([
                'status' => $status === 'accept' ? 'in_process' : $status,
                'note' => $note,
                'rejection_reason' => $status === 'reject' ? $rejection_reason : null,
                'astimated_transfer_time' => $status === 'accept' ? Carbon::parse($astimated_payment_date) : null,
            ]);

            $mechanic = $withdrawalRequest->mechanic;
            if($status === 'accept'){
                $mechanic->update([
                    'balence' => $mechanic->balence - $withdrawalRequest->amount,
                ]);
                
                $pdf = Pdf::loadView('pdf.invoice', compact('withdrawalRequest'))
                ->setPaper('A4', 'portrait')
                ->setOption('isRemoteEnabled', true)
                ->setOption('isHtml5ParserEnabled', true)
                ->setOption('isFontSubsettingEnabled', true);

                $invoiceNo = Helpers::shortUuid();
                $fileName = 'invoice_' . $invoiceNo . '.pdf';
                $filePath = 'invoices/' . $fileName;
                Storage::disk('public')->put($filePath, $pdf->output());

                $withdrawalRequest->update([
                    'invoice_path' => $fileName,
                ]);
            }

            if (env("CAN_SEND_MESSAGE")) {
                $lang         = "en";
                $phone        = $mechanic->phone;
                if($status === 'accept'){
                    $templateName = "msg_to_mechanic_on_accept_withdrawal_request";
                    $data = [
                        $mechanic->name ?? '--',
                        $astimated_payment_date ? Carbon::parse($astimated_payment_date)->format('d M Y') : '--',
                    ];
                }elseif($status === 'reject'){
                    $templateName = "msg_to_mechanic_on_reject_his_withdrawal_request";
                    $data = [
                        $mechanic->name ?? '--',
                        $rejection_reason ?? '--',
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
