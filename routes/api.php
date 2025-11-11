<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CommonController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/otp-login', [AuthController::class, 'OTPlogin']);
Route::post('/verify-otp', [AuthController::class, 'verifyOTP']);


Route::prefix('common')->group(function () {
    Route::get('/countries-list', [CommonController::class, 'getAllCountries']);
    Route::get('/states-list/{country_id?}', [CommonController::class, 'getCountryStates']);
    Route::get('/cities-list/{state_id?}', [CommonController::class, 'getStateCities']);
});

// Protected routes (require login)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/logout', [AuthController::class, 'logout']);
    Route::post('/update-profile', [ProfileController::class, 'updateProfile']);
    Route::post('/update-profile-image', [ProfileController::class, 'updateProfileImage']);
    Route::post('/save-address', [ProfileController::class, 'saveAddress']);
    Route::post('/update-address/{uuid}', [ProfileController::class, 'updateAddress']);
    Route::get('/get-address-list', [ProfileController::class, 'getAddressList']);
    Route::get('/delete-address/{uuid}', [ProfileController::class, 'deleteAddress']);

    Route::prefix('/vehicle')->group(function () {
        Route::post('/add', [VehicleController::class, 'add']);
        Route::post('/update/{uuid}', [VehicleController::class, 'update']);
        Route::get('/view-details/{uuid}', [VehicleController::class, 'viewVehicleDetails']);
        Route::get('/get-vehicles-list', [VehicleController::class, 'getVehicleList']);
        Route::get('/delete/{uuid}', [VehicleController::class, 'delete']);
        Route::get('/update-status/{uuid}/{status}', [VehicleController::class, 'updateStatus']);
    });

    Route::prefix('/booking')->group(function () {
        Route::post('/service-book', [BookingController::class, 'bookService']);
    });
});
