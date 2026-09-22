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
        Schema::create('downloads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entitlement_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('order_item_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // null if guest
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('downloaded_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('downloads');
    }
};
