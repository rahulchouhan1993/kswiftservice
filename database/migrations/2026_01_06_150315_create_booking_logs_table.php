<?php

use App\Models\Booking;
use App\Models\MechanicJob;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booking_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignIdFor(Booking::class);
            $table->foreignIdFor(User::class);
            $table->foreignId('mechanic_id')->comment('User Id')->nullable();
            $table->foreignIdFor(MechanicJob::class)->nullable();
            $table->string('status');
            $table->string('log_msg');
            $table->string('cancellation_reason')->nullable();
            $table->string('rejection_reason')->nullable();
            $table->timestamp('booking_date')->nullable();
            $table->timestamp('cancel_date')->nullable();
            $table->timestamp('delivery_date')->nullable();
            $table->timestamp('reject_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_logs');
    }
};
