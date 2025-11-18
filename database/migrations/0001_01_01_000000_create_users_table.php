<?php

use App\Models\Branch;
use App\Models\City;
use App\Models\Country;
use App\Models\Role;
use App\Models\State;
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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->string('role')->default('customer')->comment('customer, mechanic');
            $table->string('profile_pic')->nullable();
            $table->string('name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('dob')->nullable();

            $table->string('phone')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('whatsapp_number')->nullable();

            $table->string('otp')->nullable();
            $table->timestamp('otp_expire')->nullable();

            $table->string('email')->nullable();
            $table->timestamp('email_verified_at')->nullable();

            $table->foreignIdFor(Country::class)->nullable();
            $table->foreignIdFor(State::class)->nullable();
            $table->foreignIdFor(City::class)->nullable();
            $table->longText('address')->nullable();
            $table->string('pincode')->nullable();


            $table->string('aadharcard_no')->nullable();
            $table->string('kyc_status')->default('pending')->comment('pending, complete');
            $table->longText('kyc_response')->nullable();

            $table->string('password')->nullable();
            $table->tinyInteger('status')->default(1)->comment('0-InActive, 1-Active');
            $table->tinyInteger('is_profile_updated')->default(0)->comment('0-No, 1-Yes');

            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
