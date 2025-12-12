<?php

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
        Schema::create('whatsapp_msg_histories', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignIdFor(User::class)->nullable();
            $table->string('template_name');
            $table->string('phone');
            $table->string('status');
            $table->longText('response');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_msg_histories');
    }
};
