<?php

use App\Models\City;
use App\Models\Country;
use App\Models\State;
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
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->string('address_type')->comment('office, home');
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Country::class)->nullable();
            $table->foreignIdFor(State::class)->nullable();
            $table->foreignIdFor(City::class)->nullable();
            $table->longText('address');
            $table->string('pincode');
            $table->tinyInteger('is_default_address')->default(0)->comment('0-No, 1-Yes');
            $table->tinyInteger('status')->default(1)->comment('0-InActive, 1-Active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
