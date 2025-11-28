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
        Schema::create('mechanic_jobs', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignIdFor(User::class)->comment('mechanic id');
            $table->foreignIdFor(Booking::class);
            $table->string('status')->comment('pending, accepted, rejected');
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mechanic_jobs');
    }
};