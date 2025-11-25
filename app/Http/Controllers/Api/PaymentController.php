<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;

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
            return $request->all();
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
