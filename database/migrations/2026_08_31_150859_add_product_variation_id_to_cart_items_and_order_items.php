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
        Schema::table('cart_items', function (Blueprint $table) {
            $table->foreignId('product_variation_id')->after('product_id')->constrained()->cascadeOnDelete();
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('product_variation_id')->after('product_id')->nullable()->constrained()->nullOnDelete();
        });

        Schema::table('entitlements', function (Blueprint $table) {
            $table->foreignId('product_variation_id')->after('product_id')->constrained()->cascadeOnDelete();
            $table->integer('download_count')->default(0)->after('product_variation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropForeign(['product_variation_id']);
            $table->dropColumn('product_variation_id');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['product_variation_id']);
            $table->dropColumn('product_variation_id');
        });

        Schema::table('entitlements', function (Blueprint $table) {
            $table->dropForeign(['product_variation_id']);
            $table->dropColumn(['product_variation_id', 'download_count']);
        });
    }
};
