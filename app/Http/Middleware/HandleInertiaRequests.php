<?php

namespace App\Http\Middleware;

use App\Models\ContactUsMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Middleware;

use function App\getCurrentGuardAndUser;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $guards = ['superadmin', 'web'];
        $user = null;
        $activeGuard = null;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();
                $activeGuard = $guard;
                break;
            }
        }


        return array_merge(parent::share($request), [
            'messages' => flash()->render('array'),

            'auth' => [
                'user' => $user,
                'guard' => $activeGuard,

                // 'permissions' => $user ? $user->getAllPermissions()->pluck('name')->toArray() : [],
            ],

            'enquiryCount' => ContactUsMessage::whereIsRead(0)->count(),
            'flash' => [
                'success' => $request->session()->pull('success'),
                'error' => $request->session()->pull('error'),
                'warning' => $request->session()->pull('warning'),
                'info' => $request->session()->pull('info'),
            ],
        ]);
    }
}
