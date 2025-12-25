<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Booking;
use App\Models\Branch;
use App\Models\Category;
use App\Models\ContactUsMessage;
use App\Models\MechanicJob;
use App\Models\Order;
use App\Models\Partner;
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

        /* ---------------- Dashboard Counters ---------------- */
        $customers     = User::whereRole('customer')->count();
        $mechanics     = User::whereRole('mechanic')->count();
        $injobs        = MechanicJob::whereStatus('accepted')->count();
        $completedjobs = MechanicJob::whereStatus('completed')->count();
        $cancelledjobs = MechanicJob::whereStatus('cancelled')->count();

        $newMessages = ContactUsMessage::whereIsRead(0)
            ->orderBy('created_at', 'DESC');

        $activityLogs = ActivityLog::with('user')
            ->whereBetween('created_at', [
                Carbon::today()->startOfDay(),
                Carbon::today()->endOfDay(),
            ])
            ->orderBy('created_at', 'DESC')
            ->paginate(7, ['*'], 'activity_page');

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
            ->through(function ($booking) {

                $customerModel = $booking->customer;
                $customer = $customerModel ? [
                    'id'    => $customerModel->id,
                    'uuid'    => $customerModel->uuid,
                    'role'    => $customerModel->role,
                    'name'  => $customerModel->name . ' ' . $customerModel->last_name,
                    'email' => $customerModel->email,
                    'phone' => $customerModel->phone,
                    'profile_photo_url' => $customerModel->profile_photo_url,
                ] : null;

                $paymentModel = $booking->payment;
                $payment = ($paymentModel && $paymentModel->status === 'success') ? [
                    'id'           => $paymentModel->id,
                    'txnId'        => $paymentModel->txnId,
                    'amount'       => $paymentModel->amount,
                    'payment_mode' => $paymentModel->payment_mode,
                    'status'       => $paymentModel->status,
                    'invoice_url'  => $paymentModel->invoice_url,
                    'received_at'  => $paymentModel->received_at,
                ] : null;

                $services = $booking->services->isNotEmpty()
                    ? $booking->services->map(fn($service) => [
                        'id' => $service->id,
                        'service_type' => $service->service_type ? [
                            'id'         => $service->service_type->id,
                            'name'       => $service->service_type->name,
                            'base_price' => $service->service_type->base_price,
                        ] : null,
                    ])
                    : null;

                $mechanicModel = $booking->mechanic;
                $mechanic = $mechanicModel ? [
                    'id'    => $mechanicModel->id,
                    'uuid'    => $mechanicModel->uuid,
                    'role'    => $mechanicModel->role,
                    'name'  => $mechanicModel->name . ' ' . $mechanicModel->last_name,
                    'email' => $mechanicModel->email,
                    'phone' => $mechanicModel->phone,
                    'profile_photo_url' => $mechanicModel->profile_photo_url,
                ] : null;

                $vehicleModel = $booking->vehicle;
                $vehicle = $vehicleModel ? [
                    'id'             => $vehicleModel->id,
                    'vehicle_number' => $vehicleModel->vehicle_number,
                    'model'          => $vehicleModel->model,
                    'vehicle_type'   => $vehicleModel->vehicle_type,
                    'fuel_type'      => $vehicleModel->fuel_type,
                    'vehile_make'    => $vehicleModel->vehile_make
                        ? $vehicleModel->vehile_make
                        : null,
                    'vehicle_photos' => $vehicleModel->vehicle_photos ?? [],
                ] : null;

                $pickup = $booking->pickup_address;
                $pickupAddress = $pickup ? [
                    'id' => $pickup->id,
                    'address_type' => $pickup->address_type,
                    'country_id' => $pickup->country_id,
                    'state_id' => $pickup->state_id,
                    'city_id' => $pickup->city_id,
                    'address' => $pickup->address,
                    'pincode' => $pickup->pincode,
                    'is_default_address' => $pickup->is_default_address,
                ] : null;

                // Drop Address
                $drop = $booking->drop_address;
                $dropAddress = $drop ? [
                    'id' => $drop->id,
                    'address_type' => $drop->address_type,
                    'country_id' => $drop->country_id,
                    'state_id' => $drop->state_id,
                    'city_id' => $drop->city_id,
                    'address' => $drop->address,
                    'pincode' => $drop->pincode,
                    'is_default_address' => $drop->is_default_address,
                ] : null;


                return [
                    'id'             => $booking->id,
                    'uuid'           => $booking->uuid,
                    'booking_id'     => $booking->booking_id,
                    'date'           => $booking->date,
                    'time'           => $booking->time,
                    'booking_status' => $booking->booking_status,
                    'assigned_at'    => $booking->assigned_at,
                    'delivered_at'   => $booking->delivered_at,
                    'booking_date'   => $booking->booking_date,
                    'created_at'     => $booking->created_at,
                    'pickup_type' => $booking->pickup_type,
                    'pickup_address' => $pickupAddress,
                    'drop_address' => $dropAddress,

                    'customer' => $customer,
                    'services' => $services,
                    'vehicle'  => $vehicle,
                    'mechanic' => $mechanic,
                    'payment'  => $payment,
                ];
            });

        return Inertia::render('SuperAdmin/Dashboard', [
            'authUser'        => $auth,
            'customers'       => $customers,
            'mechanics'       => $mechanics,
            'active_bookings' => $bookings,

            'newMessages'     => $newMessages->count(),
            'newMessagesData' => $newMessages->limit(5)->get(),
            'injobs'          => $injobs,
            'completedjobs'   => $completedjobs,
            'cancelledjobs'   => $cancelledjobs,
            'activity_logs'   => $activityLogs,
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
