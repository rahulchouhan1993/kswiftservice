<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Category;
use App\Models\Order;
use App\Models\Partner;
use App\Models\Product;
use App\Models\School;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Display Dashboard
     * @return mixed
     */
    public function index()
    {
        $auth = Auth::user();
        return Inertia::render('SuperAdmin/Dashboard', [
            'authUser'   => $auth,
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
}
