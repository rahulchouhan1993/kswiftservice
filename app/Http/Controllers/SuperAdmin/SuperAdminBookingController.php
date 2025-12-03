<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminBookingController extends Controller
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

        $baseQuery = Booking::with([
            'customer',
            'services',
            'services.service_type',
            'mechanic',
            'vehicle',
            'vehicle.vehile_make',
            'vehicle.vehicle_photos',
            'pickup_address',
            'drop_address',
            'payment'
        ])->orderBy('created_at', 'DESC')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('booking_id', 'LIKE', "%{$search}%");
                });
            })
            ->when(!is_null($status), function ($q) use ($status) {
                $q->where('status', $status);
            });

        $bookings = (clone $baseQuery)->paginate($this->per_page ?? 50)->withQueryString();

        return Inertia::render('SuperAdmin/Bookings/List', [
            'list' => $bookings,
            'search' => $search,
            'status' => $status,
        ]);
    }
}
