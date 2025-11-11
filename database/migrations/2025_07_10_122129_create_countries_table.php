<?php

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
        Schema::create('countries', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable();
            $table->string('iso_2', 4)->nullable();
            $table->string('iso_3', 4)->nullable();
            $table->string('phone_code', 20)->nullable();
            $table->string('currency', 50)->nullable();
            $table->text('flag')->nullable();
            $table->tinyInteger('status')->default(1)->comment('1-Active, 0-InActive');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('countries');
    }
};
