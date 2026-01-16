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
        Schema::table('mechanic_jobs', function (Blueprint $table) {
            $table->foreignId('cancelled_by')->nullable()->comment('User Id');
            $table->timestamp('cancel_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mechanic_jobs', function (Blueprint $table) {
            //
        });
    }
};
