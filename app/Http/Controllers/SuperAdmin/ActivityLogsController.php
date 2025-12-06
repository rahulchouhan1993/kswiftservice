<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogsController extends Controller
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
        $baseQuery = ActivityLog::with(['user'])->orderBy('created_at', 'DESC')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('title', 'LIKE', "%{$search}%");
                    $q->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%")
                            ->orWhere('phone', 'LIKE', "%{$search}%");
                    });
                });
            });


        $activities = (clone $baseQuery)->paginate($this->per_page ?? 50)->withQueryString();
        return Inertia::render('SuperAdmin/ActivityLogs/List', [
            'list' => $activities,
            'search' => $search,
        ]);
    }
}
