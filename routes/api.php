<?php

use App\Http\Controllers\Api\AadharCardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CommonController;
use App\Http\Controllers\Api\GarageController;
use App\Http\Controllers\Api\JobsController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\TicketController;
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
    Route::get('/get-all-vehicle-makes', [CommonController::class, 'getVehicleMakes']);
    Route::get('/get-vehicle-make-all-vehicles/{uuid?}', [CommonController::class, 'getVehicleMakeAllVehiclesList']);
    Route::get('/fetch-services-list', [CommonController::class, 'getServicesList']);
});

// Protected routes (require login)
Route::middleware('apiauth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/update-profile', [ProfileController::class, 'updateProfile']);
    Route::get('/user-details/{uuid}', [ProfileController::class, 'getUserDetails']);
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
        Route::post('/update-booking-status', [BookingController::class, 'updateBookingStatus']);
        Route::get('/fetch-bookings/{status?}', [BookingController::class, 'fetchBookings']);
        Route::get('/get-booking-details/{uuid}', [BookingController::class, 'getBookingDetails']);
        Route::get('/get-home-page-bookings-list', [BookingController::class, 'getHomePageBooksList']);
        Route::post('/upload-service-video-or-photo', [BookingController::class, 'uploadBookingVideos']);
        Route::get('/fetch-service-video-or-photo/{uuid}', [BookingController::class, 'fetchServicesVideos']);
    });

    Route::prefix('/ticket')->group(function () {
        Route::get('/get-tickets-list', [TicketController::class, 'getTicketsList']);
        Route::post('/submit', [TicketController::class, 'submitTicket']);
        Route::get('/get-ticket-details/{uuid}', [TicketController::class, 'getTicketDetails']);
    });


    Route::prefix('/payment')->group(function () {
        Route::post('/submit-payment-details', [PaymentController::class, 'submitPaymentDetails']);
        Route::get('/fetch-invoice-and-receipts', [PaymentController::class, 'paymentInvoicesAndReceipts']);
        Route::get('/fetch-transaction-history', [PaymentController::class, 'transactionHistory']);
    });


    // Mechanic API's
    Route::prefix('/aadhar-card')->group(function () {
        Route::post('/send-verification-otp', [AadharCardController::class, 'sendVerificationOTP']);
        Route::post('/verify-otp', [AadharCardController::class, 'verifyVerificationOTP']);
    });

    Route::prefix('/garage')->group(function () {
        Route::post('/add', [GarageController::class, 'add']);
        Route::post('/update/{uuid}', [GarageController::class, 'update']);
        Route::get('/view-details/{uuid}', [GarageController::class, 'viewGarageDetails']);
        Route::get('/get-garage-list', [GarageController::class, 'getGarageList']);
        Route::get('/delete/{uuid}', [GarageController::class, 'delete']);
        Route::get('/delete-photo/{uuid}', [GarageController::class, 'deleteGaragePhoto']);
        Route::get('/update-status/{uuid}/{status}', [GarageController::class, 'updateStatus']);
    });


    Route::prefix('/jobs')->group(function () {
        Route::get('/fetch-jobs-list/{status}', [JobsController::class, 'fetchJobsList']);
        Route::post('/update-status/{uuid}', [JobsController::class, 'updateStatus']);
    });
});
