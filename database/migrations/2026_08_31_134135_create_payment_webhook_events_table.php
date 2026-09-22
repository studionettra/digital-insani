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
        Schema::create('payment_webhook_events', function (Blueprint $table) {
            $table->id();
            $table->string('provider')->default('midtrans');
            $table->string('event_type');
            $table->string('external_id')->nullable();
            $table->json('payload');
            $table->string('status')->default('pending'); // pending, processed, failed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_webhook_events');
    }
};
