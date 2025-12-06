<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * Handle unauthenticated requests (invalid or missing token)
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->is('api/*')) {
            return response()->json([
                'status'  => false,
                'message' => 'Unauthenticated. Invalid or missing token.',
            ], 401);
        }

        return parent::unauthenticated($request, $exception);
    }

    /**
     * Render exceptions into HTTP responses.
     */
    public function render($request, Throwable $e)
    {
        if ($request->is('api/*')) {

            if ($e instanceof NotFoundHttpException) {
                return response()->json([
                    'status'  => false,
                    'message' => 'API URL not exist',
                    'path'    => $request->path(),
                ], 404);
            }

            if ($e instanceof MethodNotAllowedHttpException) {
                return response()->json([
                    'status'          => false,
                    'message'         => 'Request method not supported for this API',
                    'allowed_methods' => $e->getHeaders()['Allow'] ?? [],
                ], 405);
            }

            if ($e instanceof RouteNotFoundException) {
                return response()->json([
                    'status'  => false,
                    'message' => 'API route not found or parameter missing',
                ], 404);
            }

            if ($e instanceof RouteNotFoundException) {
                return response()->json([
                    'status'  => false,
                    'message' => 'API route not found or parameter missing',
                ], 500);
            }
        }

        return parent::render($request, $e);
    }

    /**
     * Fallback for ALL unhandled exceptions (Laravel 12+)
     */
    public function register()
    {
        $this->renderable(function (Throwable $e, $request) {
            if ($request->is('api/*')) {

                return response()->json([
                    'status'  => false,
                    'message' => 'Internal server error',
                    'error'   => config('app.debug') ? $e->getMessage() : null,
                ], 500);
            }
        });
    }
}
