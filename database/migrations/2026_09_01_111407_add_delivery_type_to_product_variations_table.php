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
        Schema::table('product_variations', function (Blueprint $table) {
            $table->enum('delivery_type', ['file', 'url'])->default('file')->after('price');
            $table->text('file_url')->nullable()->after('file_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_variations', function (Blueprint $table) {
            $table->dropColumn(['delivery_type', 'file_url']);
        });
    }
};
