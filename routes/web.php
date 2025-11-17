<?php

namespace App\Http\Controllers;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\SuperAdmin\AdminAuthController;
use App\Http\Controllers\SuperAdmin\AdminDashboardController;
use App\Http\Controllers\SuperAdmin\ServiceTypeController;
use App\Http\Controllers\SuperAdmin\UsersController;
use App\Http\Controllers\SuperAdmin\VehicleMakeController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use PHPUnit\Metadata\Group;

Route::get('/', [HomeController::class, 'home'])->name('home');
Route::get('/about-us', [HomeController::class, 'aboutUs'])->name('aboutus');
Route::get('/our-services', [HomeController::class, 'services'])->name('services');
Route::get('/contact-us', [HomeController::class, 'contactUs'])->name('contactus');
Route::get('/privacy-and-policy', [HomeController::class, 'privacyPolicy'])->name('privacy-ploicy');
Route::get('/terms-and-conditions', [HomeController::class, 'termsConditions'])->name('terms-condition');



// SUPERADMIN ROUTES START FROM HERE
Route::prefix('/superadmin')->name('superadmin.')->group(function () {
    Route::middleware('authorized:superadmin')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'login'])->name('login');
        Route::post('/verify', [AdminAuthController::class, 'verify'])->name('verify');
    });

    Route::middleware('auth.superadmin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::post('/logout', [AdminDashboardController::class, 'logout'])->name('logout');

        Route::prefix('settings')->name('settings.')->group(function () {
            Route::prefix('vehicle-makes')->name('vehicle.make.')->group(function () {
                Route::get('list', [VehicleMakeController::class, 'index'])->name('list');
                Route::post('/create', [VehicleMakeController::class, 'add'])->name('create');
                Route::post('/update/{uuid?}', [VehicleMakeController::class, 'update'])->name('update');
                Route::post('/{uuid}/update-status', [VehicleMakeController::class, 'updateStatus'])->name('update.status');
                Route::post('/{uuid}/delete', [VehicleMakeController::class, 'delete'])->name('delete');
            });


            Route::prefix('service-type')->name('service.type.')->group(function () {
                Route::get('list', [ServiceTypeController::class, 'index'])->name('list');
                Route::post('/create', [ServiceTypeController::class, 'add'])->name('create');
                Route::post('/update/{uuid?}', [ServiceTypeController::class, 'update'])->name('update');
                Route::post('/{uuid}/update-status', [ServiceTypeController::class, 'updateStatus'])->name('update.status');
                Route::post('/{uuid}/delete', [ServiceTypeController::class, 'delete'])->name('delete');
            });
        });


        Route::prefix('user')->name('user.')->group(function () {
            Route::get('list', [UsersController::class, 'index'])->name('list');
            Route::post('/{uuid}/update-status', [UsersController::class, 'updateStatus'])->name('update.status');
            Route::post('/{uuid}/delete', [UsersController::class, 'delete'])->name('delete');
        });
    });
});
// SUPERADMIN ROUTES END HERE




// require __DIR__ . '/auth.php';
Route::get('/clear', function () {
    Artisan::call('cache:clear');
    Artisan::call('route:cache');
    Artisan::call('view:clear');
    Artisan::call('optimize:clear');
    return 'Application cache has been cleared';
});
