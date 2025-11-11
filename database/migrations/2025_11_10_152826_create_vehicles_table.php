<?php

use App\Models\User;
use App\Models\UserAddress;
use App\Models\VehicleMake;
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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(VehicleMake::class);
            $table->string('vehicle_number')->nullable();
            $table->string('model')->nullable();
            $table->string('vehicle_year')->nullable();
            $table->string('fuel_type')->comment('Petrol, Diesel, Hybrid, Electric');
            $table->string('transmission')->nullable()->comment('Manual, Automatic');
            $table->string('mileage')->nullable()->comment('Eg: New-10,000 KM');
            $table->foreignIdFor(UserAddress::class)->nullable()->comment('where vehicle parked');
            $table->tinyInteger('status')->default(1)->comment('0-InActive, 1-Active');
            $table->longText('additional_note')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
