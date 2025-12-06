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
        $search      = $request->query('search');
        $status      = $request->query('status');
        $start_date  = $request->query('start_date');
        $end_date    = $request->query('end_date');

        $payments = Payment::with(['user', 'booking', 'booking.vehicle', 'booking.mechanic'])
            ->orderBy('created_at', 'DESC')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('txnId', 'LIKE', "%{$search}%")
                        ->orWhere('amount', 'LIKE', "%{$search}%");
                });
            })
            ->when($status, function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->when($start_date, function ($q) use ($start_date) {
                $q->whereDate('created_at', '>=', $start_date);
            })
            ->when($end_date, function ($q) use ($end_date) {
                $q->whereDate('created_at', '<=', $end_date);
            })

            ->paginate($this->per_page ?? 50)
            ->withQueryString();

        return Inertia::render('SuperAdmin/Payments/List', [
            'list'       => $payments,
            'search'     => $search,
            'status'     => $status,
            'start_date' => $start_date,
            'end_date'   => $end_date,
        ]);
    }
}
