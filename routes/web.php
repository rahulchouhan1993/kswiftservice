<?php

namespace App\Http\Controllers;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\SuperAdmin\ActivityLogsController;
use App\Http\Controllers\SuperAdmin\AdminAuthController;
use App\Http\Controllers\SuperAdmin\AdminDashboardController;
use App\Http\Controllers\SuperAdmin\ChatsController;
use App\Http\Controllers\SuperAdmin\ContactUsEnquiriesController;
use App\Http\Controllers\SuperAdmin\MechanicJobsControler;
use App\Http\Controllers\SuperAdmin\ServiceTypeController;
use App\Http\Controllers\SuperAdmin\SuperAdminBookingController;
use App\Http\Controllers\SuperAdmin\SuperAdminMechanicController;
use App\Http\Controllers\SuperAdmin\TransactionHistoryController;
use App\Http\Controllers\SuperAdmin\UserChatsController;
use App\Http\Controllers\SuperAdmin\UsersController;
use App\Http\Controllers\SuperAdmin\VehicleMakeController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use PHPUnit\Metadata\Group;

Route::get('/', [HomeController::class, 'home'])->name('home');
Route::get('/about-us', [HomeController::class, 'aboutUs'])->name('aboutus');
Route::get('/our-services', [HomeController::class, 'services'])->name('services');
Route::get('/contact-us', [HomeController::class, 'contactUs'])->name('contactus');
Route::post('/submit-contactus', [HomeController::class, 'submitContactUs'])->name('submit.contactus');
Route::get('/privacy-and-policy', [HomeController::class, 'privacyPolicy'])->name('privacy-ploicy');
Route::get('/terms-and-conditions', [HomeController::class, 'termsConditions'])->name('terms-condition');
Route::get('/partner-terms-conditions', [HomeController::class, 'partnerTermsConditions'])->name('partner-terms-conditions');
Route::get('/customer-terms-conditions', [HomeController::class, 'customerTermsConditions'])->name('customer-terms-conditions');
Route::get('/business-policy', [HomeController::class, 'businessPolicy'])->name('business-policy');
Route::get('/offers', [HomeController::class, 'offers'])->name('offers');
Route::match(['get', 'post'], '/delete-account', [HomeController::class, 'deleteAccount'])->name('delete.account');

Route::post('language/{locale}', function ($locale) {
    session()->put('locale', $locale);
    return redirect()->back();
})->name('language');


Route::prefix('common')->name('common.')->group(function () {
    Route::get('/search-garages', [CommonController::class, 'serachGarages'])->name('search.garage');
});


// SUPERADMIN ROUTES START FROM HERE
Route::prefix('/superadmin')->name('superadmin.')->group(function () {
    Route::middleware('authorized:superadmin')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'login'])->name('login');
        Route::post('/verify', [AdminAuthController::class, 'verify'])->name('verify');
    });

    Route::middleware('auth.superadmin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::post('/logout', [AdminDashboardController::class, 'logout'])->name('logout');
        Route::match(['get', 'post'], '/update-profile', [AdminDashboardController::class, 'updateProfile'])->name('update.profile');
        Route::post('/update-password', [AdminDashboardController::class, 'updatePassowrd'])->name('update.password');



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


        Route::prefix('bookings')->name('booking.')->group(function () {
            Route::get('/list/{user_id?}/{user_type?}', [SuperAdminBookingController::class, 'list'])->name('list');
            Route::post('/assign-mechanic', [SuperAdminBookingController::class, 'assignMechanic'])->name('assign.mechanic');
            Route::post('/cancel-mechanic-assign-request', [SuperAdminBookingController::class, 'cancelAssignMechanicRequest'])->name('cancel.assign.mechanic');

            Route::prefix('/chats')->name('chat.')->group(function () {
                Route::get('/list/{uuid?}', [UserChatsController::class, 'list'])->name('list');
                Route::post('/send-message/{uuid?}', [UserChatsController::class, 'sendMessage'])->name('sendmessage');
                Route::post('/{uuid?}/update-chat-status', [UserChatsController::class, 'updateChatsStatus'])->name('update.chat.status');
            });
        });


        Route::prefix('user')->name('user.')->group(function () {
            Route::get('/list', [UsersController::class, 'index'])->name('list');
            Route::post('/add', [UsersController::class, 'add'])->name('add');
            Route::post('/update/{uuid?}', [UsersController::class, 'update'])->name('update');
            Route::post('/{uuid}/update-status', [UsersController::class, 'updateStatus'])->name('update.status');
            Route::post('/{uuid}/update-password', [UsersController::class, 'updatePassword'])->name('update.password');
            Route::get('/{uuid}/details', [UsersController::class, 'details'])->name('details');
            Route::post('/{uuid}/delete', [UsersController::class, 'delete'])->name('delete');

            Route::prefix('address')->name('address.')->group(function () {
                Route::get('list', [UsersController::class, 'addressList'])->name('list');
            });
        });

        Route::prefix('mechanics')->name('mechanic.')->group(function () {
            Route::get('/list', [SuperAdminMechanicController::class, 'index'])->name('list');
            Route::post('/add', [SuperAdminMechanicController::class, 'add'])->name('add');
            Route::post('/update/{uuid?}', [SuperAdminMechanicController::class, 'update'])->name('update');
            Route::post('/{uuid}/update-status', [SuperAdminMechanicController::class, 'updateStatus'])->name('update.status');
            Route::post('/{uuid}/update-password', [SuperAdminMechanicController::class, 'updatePassword'])->name('update.password');
            Route::get('/{uuid}/details', [SuperAdminMechanicController::class, 'details'])->name('details');
            Route::post('/{uuid}/delete', [SuperAdminMechanicController::class, 'delete'])->name('delete');

            Route::prefix('address')->name('address.')->group(function () {
                Route::get('list', [SuperAdminMechanicController::class, 'addressList'])->name('list');
            });
        });


        Route::prefix('contactus-enquiries')->name('enquiries.')->group(function () {
            Route::get('/list', [ContactUsEnquiriesController::class, 'list'])->name('list');
            Route::post('/{uuid}/update-status', [ContactUsEnquiriesController::class, 'updateReadStatus'])->name('update.status');
        });

        Route::prefix('/activity-logs')->name('activity_log.')->group(function () {
            Route::get('/list', [ActivityLogsController::class, 'list'])->name('list');
        });

        Route::prefix('/mechanic-jobs')->name('mechanic_job.')->group(function () {
            Route::get('/list', [MechanicJobsControler::class, 'list'])->name('list');
        });

        Route::prefix('/transaction-history')->name('transaction_history.')->group(function () {
            Route::get('/list', [TransactionHistoryController::class, 'list'])->name('list');
        });
    });
});
// SUPERADMIN ROUTES END HERE




Route::prefix('/test')->name('test.')->group(function () {
    Route::get('/send-push-notification', [TestController::class, 'sendNotification'])->name('list');
});


Route::prefix('webhook')->group(function () {
    Route::match(['get', 'post'], '/handle', [WebhookController::class, 'handleWebhook']);
});


// require __DIR__ . '/auth.php';
Route::get('/clear', function () {
    Artisan::call('cache:clear');
    Artisan::call('route:cache');
    Artisan::call('view:clear');
    Artisan::call('optimize:clear');
    return 'Application cache has been cleared';
});
