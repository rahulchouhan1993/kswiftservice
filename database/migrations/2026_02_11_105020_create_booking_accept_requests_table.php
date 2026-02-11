<?php

use App\Models\Booking;
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
        Schema::create('booking_accept_requests', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignId('booking_request_id')->constrained()->onDelete('cascade');
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->comment('mechanic id');
            $table->longText('note')->nullable();
            $table->longText('rejection_reason')->nullable();
            $table->timestamp('astimated_delivery_date')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->string('admin_status')->comment('accepted, rejected')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_accept_requests');
    }
};
