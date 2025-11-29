<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionHistoryController extends Controller
{
    protected $per_page;
    public function __construct()
    {
        $this->per_page = env('PER_PAGE', 50);
    }

    /**
     * Display Resourse Page
     * @param Request $request
     * @return mixed
     */

    public function list(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $baseQuery = Payment::with(['user', 'booking', 'booking.vehicle', 'booking.mechanic'])->orderBy('created_at', 'DESC')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('txnId', 'LIKE', "%{$search}%")
                        ->where('amount', 'LIKE', "%{$search}%");
                });
            })
            ->when(!is_null($status), function ($q) use ($status) {
                $q->where('status', $status);
            });

        $payments = (clone $baseQuery)->paginate($this->per_page ?? 50)->withQueryString();

        return Inertia::render('SuperAdmin/Payments/List', [
            'list' => $payments,
            'search' => $search,
            'status' => $status,
        ]);
    }
}
