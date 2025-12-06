<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\MechanicJob;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MechanicJobsControler extends Controller
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

        $baseQuery = MechanicJob::with([
            'mechanic',
            'booking',
            'booking.vehicle',
            'booking.vehicle.vehile_make',
            'booking.customer'
        ])
            ->orderBy('created_at', 'DESC')
            ->when($search, function ($q) use ($search) {

                $q->where(function ($q) use ($search) {
                    $q->where('cancellation_reason', 'LIKE', "%{$search}%")
                        ->orWhereHas('mechanic', function ($q) use ($search) {
                            $q->where('name', 'LIKE', "%{$search}%")
                                ->orWhere('email', 'LIKE', "%{$search}%")
                                ->orWhere('phone', 'LIKE', "%{$search}%");
                        })

                        ->orWhereHas('booking.customer', function ($q) use ($search) {
                            $q->where('name', 'LIKE', "%{$search}%")
                                ->orWhere('email', 'LIKE', "%{$search}%")
                                ->orWhere('phone', 'LIKE', "%{$search}%");
                        });
                });
            })
            ->when(!is_null($status), function ($q) use ($status) {
                $q->where('status', $status);
            });

        $jobs = $baseQuery->paginate($this->per_page ?? 50)->withQueryString();

        return Inertia::render('SuperAdmin/MechanicJobs/List', [
            'list' => $jobs,
            'search' => $search,
            'status' => $status,
        ]);
    }
}
