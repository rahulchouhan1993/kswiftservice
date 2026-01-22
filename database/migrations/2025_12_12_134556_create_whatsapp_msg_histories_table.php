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
            $table->foreignIdFor(User::class)->nullable();
            $table->string('msg_id')->nullable();
            $table->string('template_name')->nullable();
            $table->string('user_phone')->nullable();
            $table->string('user_name')->nullable();
            $table->string('msg_type')->default(1)->comment('0-Sent,1-Received');
            $table->string('is_read')->default(0)->comment('0-No, 1-Yes');
            $table->timestamp('sent_time');
            $table->string('related_msg_id')->nullable();
            $table->longText('message')->nullable();
            $table->string('platform')->nullable();
            $table->longText('response')->nullable();
            $table->string('status')->comment('0-sent, delivered-1,read-2,failed-3');
            $table->timestamps();
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
