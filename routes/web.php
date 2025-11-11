<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Branch\BranchAuthController;
use App\Http\Controllers\Branch\BranchDashboardController;
use App\Http\Controllers\Branch\BranchUsersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Front\EnquiryController;
use App\Http\Controllers\Front\FrontCardController;
use App\Http\Controllers\Front\SurveyEnquiryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Partner\PartnerAuthController;
use App\Http\Controllers\Partner\PartnerDashboardController;
use App\Http\Controllers\Partner\PartnerOrderController;
use App\Http\Controllers\Partner\PartnerSchoolController;
use App\Http\Controllers\SuperAdmin\AdminAuthController;
use App\Http\Controllers\SuperAdmin\AdminDashboardController;
use App\Http\Controllers\SuperAdmin\PartnerController;
use App\Models\ImportProcess;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

use function App\getCurrentGuardAndUser;

Route::get('/', [HomeController::class, 'home'])->name('home');





// SUPERADMIN ROUTES START FROM HERE
Route::prefix('/superadmin')->name('superadmin.')->group(function () {
    Route::middleware('authorized:superadmin')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'login'])->name('login');
        Route::post('/verify', [AdminAuthController::class, 'verify'])->name('verify');
    });

    Route::middleware('auth.superadmin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::post('/logout', [AdminDashboardController::class, 'logout'])->name('logout');
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
