<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
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
    public function index()
    {
        $auth = Auth::user();

        $customers = User::whereRole('customer')->count();
        $mechanics = User::whereRole('mechanic')->count();
        $newMessages = ContactUsMessage::whereIsRead(0)->orderBy('created_at', 'DESC');
        $injobs = MechanicJob::whereStatus('accepted')->count();
        $completedjobs = MechanicJob::whereStatus('completed')->count();
        $cancelledjobs = MechanicJob::whereStatus('cancelled')->count();
        $booking = Booking::query();

        return Inertia::render('SuperAdmin/Dashboard', [
            'authUser'   => $auth,
            'customers' => $customers,
            'mechanics' => $mechanics,
            'bookings' => $booking->count(),
            'newMessages' => $newMessages->count(),
            'injobs' => $injobs,
            'completedjobs' => $completedjobs,
            'cancelledjobs' => $cancelledjobs,
            'newMessagesData' => $newMessages->get(),
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
