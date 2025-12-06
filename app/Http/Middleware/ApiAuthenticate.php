<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class ApiAuthenticate
{
    public function handle(Request $request, Closure $next)
    {
        // Allowed domains validation
        $allowedDomains = [
            'kswiftservices.com',
            '127.0.0.1',
            'localhost'
        ];

        $requestHost = $request->getHost();

        if (!in_array($requestHost, $allowedDomains)) {
            return response()->json([
                'status' => false,
                'message' => 'Base URL invalid',
                'host' => $requestHost,
            ], 403);
        }

        // Check Authorization header
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'status' => false,
                'message' => 'Token missing'
            ], 401);
        }

        // Fetch token from database
        $accessToken = PersonalAccessToken::findToken($token);

        if (!$accessToken) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid or expired token'
            ], 401);
        }

        // Attach both the user and the token to the request
        $request->setUserResolver(function () use ($accessToken) {
            $user = $accessToken->tokenable;

            // 🔥 IMPORTANT: Attach token so currentAccessToken() works
            if (method_exists($user, 'withAccessToken')) {
                $user->withAccessToken($accessToken);
            } else {
                // Fallback for older Laravel versions
                $user->accessToken = $accessToken;
            }

            return $user;
        });

        return $next($request);
    }
}
