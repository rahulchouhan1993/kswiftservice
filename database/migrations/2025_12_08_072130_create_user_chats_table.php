<?php

use App\Models\Booking;
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
        Schema::create('user_chats', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->integer('from')->comment('from user id');
            $table->integer('to')->comment('to_user_id');
            $table->string('sender_role')->comment('msg sender role');
            $table->foreignIdFor(Booking::class);
            $table->longText('message')->nullable();
            $table->string('attechment')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_chats');
    }
};
