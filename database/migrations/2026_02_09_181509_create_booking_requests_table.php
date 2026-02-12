<?php

use App\Models\Booking;
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
        Schema::create('booking_requests', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Booking::class);
            $table->foreignId('mecanic_id')->nullable()->comment('users id');
            $table->string('mechanic_status')->default('pending')->comment('pending, accepted, rejected');
            $table->longText('note')->nullable();
            $table->longText('rejection_reason')->nullable();
            $table->timestamp('astimated_delivery_date')->nullable();
            $table->timestamp('last_updated_at')->nullable();
            $table->string('admin_status')->default('pending')->comment('pending, accepted, rejected');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_requests');
    }
};
