<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Booking;
use App\Models\Branch;
use App\Models\Category;
use App\Models\ContactUsMessage;
use App\Models\MechanicJob;
use App\Models\Order;
use App\Models\Partner;
use App\Models\Payment;
use App\Models\Product;
use App\Models\School;
use App\Models\SubCategory;
use App\Models\SuperAdmin;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

use function App\setEnv;

class AdminDashboardController extends Controller
{
    protected $per_page;
    protected $auth;
    public function __construct()
    {
        $this->per_page = env('PER_PAGE', 50);
        $this->auth = Auth::guard('superadmin')->user();
    }

    /**
     * Display Dashboard
     * @return mixed
     */
    public function index(Request $request)
    {
        $auth = Auth::user();

        // ✅ Selected Year (default current year)
        $year = (int) $request->get('year', now()->year);

        /* ---------------- Dashboard Counters ---------------- */
        $customers     = User::whereRole('customer')->count();
        $mechanics     = User::whereRole('mechanic')->count();
        $injobs        = MechanicJob::whereStatus('accepted')->count();
        $completedjobs = MechanicJob::whereStatus('completed')->count();
        $cancelledjobs = MechanicJob::whereStatus('cancelled')->count();

        /* ---------------- Messages ---------------- */
        $newMessages = ContactUsMessage::whereIsRead(0)
            ->orderBy('created_at', 'DESC');

        /* ---------------- Activity Logs ---------------- */
        $activityLogs = ActivityLog::with('user')
            ->whereBetween('created_at', [
                Carbon::today()->startOfDay(),
                Carbon::today()->endOfDay(),
            ])
            ->orderBy('created_at', 'DESC')
            ->paginate(7, ['*'], 'activity_page');

        /* ---------------- Active Bookings ---------------- */
        $bookings = Booking::whereNotIn('booking_status', ['requested', 'closed', 'completed'])
            ->with([
                'customer',
                'services.service_type',
                'mechanic',
                'payment',
                'vehicle.vehile_make',
                'vehicle.vehicle_photos',
                'pickup_address',
                'drop_address',
            ])
            ->orderBy('id', 'DESC')
            ->paginate(10, ['*'], 'booking_page')
            ->through(fn($booking) => [
                'id'             => $booking->id,
                'uuid'           => $booking->uuid,
                'booking_id'     => $booking->booking_id,
                'booking_status' => $booking->booking_status,
                'assigned_at'    => $booking->assigned_at,
                'delivered_at'   => $booking->delivered_at,
                'created_at'     => $booking->created_at,
                'customer'       => $booking->customer,
                'mechanic'       => $booking->mechanic,
                'vehicle'        => $booking->vehicle,
                'services'       => $booking->services,
                'payment'        => $booking->payment,
                'pickup_address' => $booking->pickup_address,
                'drop_address'   => $booking->drop_address,
            ]);

        /* ---------------- Total Revenue (Year Based) ---------------- */
        $totalRevenue = Payment::whereStatus('success')
            ->whereYear('created_at', $year)
            ->sum('admin_income');

        /* ==========================================================
        MONTHLY REPORTS (YEAR FILTER)
    ========================================================== */

        $monthlyBookings = Booking::join('payments', function ($join) {
            $join->on('payments.booking_id', '=', 'bookings.id')
                ->where('payments.status', 'success');
        })
            ->whereYear('payments.created_at', $year)
            ->selectRaw('MONTH(payments.created_at) as month, COUNT(DISTINCT bookings.id) as total')
            ->groupBy('month')
            ->pluck('total', 'month');

        $monthlyRevenue = Booking::join('payments', function ($join) {
            $join->on('payments.booking_id', '=', 'bookings.id')
                ->where('payments.status', 'success');
        })
            ->whereYear('payments.created_at', $year)
            ->selectRaw('MONTH(payments.created_at) as month, SUM(payments.admin_income) as total')
            ->groupBy('month')
            ->pluck('total', 'month');

        $reports = [];
        for ($m = 1; $m <= 12; $m++) {
            $monthName = Carbon::create()->month($m)->format('M');
            $reports[$monthName] = [
                'bookings' => (int) ($monthlyBookings[$m] ?? 0),
                'revenue'  => (float) ($monthlyRevenue[$m] ?? 0),
            ];
        }

        // ✅ Available years for dropdown
        $availableYears = Payment::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'DESC')
            ->pluck('year');

        return Inertia::render('SuperAdmin/Dashboard', [
            'authUser'        => $auth,
            'customers'       => $customers,
            'mechanics'       => $mechanics,
            'injobs'          => $injobs,
            'completedjobs'   => $completedjobs,
            'cancelledjobs'   => $cancelledjobs,
            'newMessages'     => $newMessages->count(),
            'newMessagesData' => $newMessages->limit(5)->get(),
            'activity_logs'   => $activityLogs,
            'active_bookings' => $bookings,
            'total_revenue'   => $totalRevenue,

            // 🔹 NEW
            'reports'         => $reports,
            'selectedYear'    => $year,
            'availableYears'  => $availableYears,
        ]);
    }






    /**
     * Logout User
     * @return mixed
     */
    public function logout(Request $request)
    {
        Auth::guard('superadmin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect(route('superadmin.login'))->with('success', 'Logout Succesfull');
    }



    /**
     * Update Super Admin Profile
     * @param Request $request
     * @return mixed
     */
    public function updateProfile(Request $request)
    {
        if ($request->isMethod('post')) {
            $user = User::find($this->auth->id);

            $request->validate([
                'name' => 'required|min:3',
                'email' => 'required|email:DNS',

                'phone' => [
                    'required',
                    'digits:10',
                    Rule::unique('users', 'phone')->ignore($user->id),
                ],

                'whatsapp_phone' => [
                    'required',
                    'digits:10',
                    function ($attr, $value, $fail) use ($user) {
                        User::where('id', '!=', $user->id)
                            ->where(
                                fn($q) =>
                                $q->where('phone', $value)
                                    ->orWhere('whatsapp_number', $value)
                            )
                            ->exists()
                            && $fail('This number already exists as phone or WhatsApp.');
                    },
                ],
            ]);
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'whatsapp_number' => $request->whatsapp_phone,
            ]);

            setEnv('ADMIN_NAME', $user->name);
            setEnv('ADMIN_PHONE', $user->whatsapp_number);
            setEnv('ADMIN_EMAIL', $user->email);

            return back()->with('success', 'Profile updated succesfully');
        }

        return Inertia::render('SuperAdmin/Profile/List');
    }


    /**
     * Update Super Admin Password
     * @param Request $request
     * @return mixed
     */
    public function updatePassowrd(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        $user = User::find($this->auth->id);
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->with('error', 'Current password is incorrect.');
        }

        $user->update([
            'password' => $request->password,
        ]);

        return back()->with('success', 'Password updated successfully.');
    }
}
