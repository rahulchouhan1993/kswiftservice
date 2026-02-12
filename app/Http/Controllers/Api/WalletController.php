<?php

namespace App\Http\Controllers\Api;

use App\FacebookApi;
use App\Http\Controllers\Controller;
use App\Models\WithdrawalRequest;
use Exception;
use Illuminate\Http\Request;

use function App\createMessageData;
use function App\createMessageHistory;
use function App\generateParameters;

class WalletController extends Controller
{
    /**
     * Get Wallet Balance
     * @return \Illuminate\Http\JsonResponse
    */
    public function getBalance(Request $request)
    {
        try{
            $user = $request->user();
            $balance = $user->balence;
            return response()->json([
                'balance' => $balance,
                'status' => true,
                'message' => 'Wallet balance retrieved successfully'
            ]);
        }catch(Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Submit Withdrawal Request
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
    */
    public function submitWithdrawalRequest(Request $request)
    {
        try{
            $request->validate([
                'amount' => 'required|numeric',
                'note' => 'nullable|string',
            ]);
            $user = $request->user();
            $balance = $user->balence;

            if($user->role != 'mechanic'){
                return response()->json([
                    'status' => false,
                    'message' => 'Only mechanics can submit withdrawal requests'
                ], 400);
            }
            
            $requestedAmount = $request->input('amount');
            if($requestedAmount > $balance){
                return response()->json([
                    'status' => false,
                    'current_balance' => $balance,
                    'message' => 'Insufficient balance'
                ], 400);
            }

            // if($requestedAmount < env('MINIMUM_WITHDRAWAL_AMOUNT')){
            //     return response()->json([
            //         'status' => false,
            //         'message' => 'Minimum withdrawal amount is '.env('MINIMUM_WITHDRAWAL_AMOUNT')
            //     ], 400);
            // }

            $wRequest = WithdrawalRequest::create([
                'user_id' => $user->id,
                'amount' => $requestedAmount,
                'note' => $request->input('note'),
            ]);

            if (env('CAN_SEND_MESSAGE')) {
                $tempName = "msg_to_mechanic_on_submit_withdrawal_request";
                $phone = $user->phone;
                $params = [
                    $user->name
                ];
                
                $msgData = createMessageData($phone,$tempName,'en',generateParameters($params));
                $fb = new FacebookApi();
                $resp = $fb->sendMessage($msgData);
                createMessageHistory($tempName, $user, $phone, $resp);
            }

            return response()->json([
                'balance' => $user->balence,
                'status' => true,
                'message' => 'Withdrawal request submitted successfully',
                'request' => $wRequest->toArray()
            ]);
        }catch(Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }   

    /**
     * Get Withdrawal Requests
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
    */
    public function getWithdrawalRequests(Request $request)
    {
        try{
            $user = $request->user();
            $status = $request->input('status');
            $query = WithdrawalRequest::whereUserId($user->id)->orderBy('created_at', 'desc');
            if($status){
                $query = $query->where('status', $status);
            }
            $withdrawalRequests = $query->get();
            
            return response()->json([
                'status' => true,
                'message' => 'Withdrawal requests retrieved successfully',
                'requests' => $withdrawalRequests->toArray()
            ]);
        }catch(Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
