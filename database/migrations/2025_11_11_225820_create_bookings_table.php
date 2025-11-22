<?php

use App\Models\User;
use App\Models\UserAddress;
use App\Models\Vehicle;
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
            $table->string('booking_id');
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Vehicle::class);
            $table->date('date')->nullable();
            $table->time('time')->nullable();
            $table->string('pickup_type')->comment('pick_up, self_drop');
            $table->foreignId('pickup_id')->nullable()->comment('user_address_id for pickup');
            $table->foreignId('drop_id')->nullable()->comment('user_address_id for drop');
            $table->longText('additional_note')->nullable();
            $table->longText('extra_services')->nullable();

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
