<?php

use App\Models\User;
use App\Models\UserAddress;
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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignIdFor(User::class);
            $table->double('booking_amount')->nullable();
            $table->double('booking_discount')->nullable();

            $table->date('date')->nullable();
            $table->string('time')->nullable();
            $table->string('pickup_type')->comment('pick_up, self_drop');
            $table->foreignIdFor(UserAddress::class)->nullable()->comment('user_address_id if pickup_type is-pick_up');

            $table->tinyInteger('status')->comment('0-InActive, 1-Active')->default(1);
            $table->string('booking_status')->comment('requested, pending, accepted, rejected, completed')->default('requested');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
