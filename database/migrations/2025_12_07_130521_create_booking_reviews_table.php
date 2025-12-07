<?php

use App\Models\Garage;
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
        Schema::create('booking_reviews', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignIdFor(User::class);
            $table->foreignId('mechanic_id')->nullable();
            $table->foreignIdFor(Garage::class)->nullable();
            $table->integer('review');
            $table->longText('feedback');
            $table->tinyInteger('status')->default(1)->comment('1-Active,0-InActive');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_reviews');
    }
};
