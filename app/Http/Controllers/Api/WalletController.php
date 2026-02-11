<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;

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
}
