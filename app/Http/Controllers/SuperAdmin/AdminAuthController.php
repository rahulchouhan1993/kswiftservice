<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminAuthController extends Controller
{
    /**
     * @return mixed
     */
    public function login()
    {
        return Inertia::render('SuperAdmin/Auth/Login');
    }



    /**
     * Super Amdin Login
     * @param Request $request
     * @return mixed
     */
    public function verify(Request $request)
    {
        $credentials = $request->validate([
            'email' => [
                'required',
                Rule::exists('users', 'email'),
            ],
            'password' => 'required',
        ]);

        if (Auth::guard('superadmin')->attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->route('superadmin.dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }
}
