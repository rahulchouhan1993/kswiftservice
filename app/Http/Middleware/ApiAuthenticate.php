<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class ApiAuthenticate
{
    public function handle(Request $request, Closure $next)
    {
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

        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'status' => false,
                'message' => 'Token missing'
            ], 401);
        }

        $accessToken = PersonalAccessToken::findToken($token);

        if (!$accessToken) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid or expired token'
            ], 401);
        }

        $request->setUserResolver(function () use ($accessToken) {
            return $accessToken->tokenable;
        });

        return $next($request);
    }
}
