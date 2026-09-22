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
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('subtotal', 15, 2)->default(0)->after('order_number');
            $table->decimal('discount_amount', 15, 2)->default(0)->after('subtotal');
            $table->string('coupon_code')->nullable()->after('discount_amount');
            $table->string('external_id')->nullable()->unique()->after('status');
            $table->string('payment_id')->nullable()->after('external_id');
            $table->string('payment_url')->nullable()->after('payment_id');
            $table->timestamp('paid_at')->nullable()->after('payment_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'subtotal', 'discount_amount', 'coupon_code', 'external_id',
                'payment_id', 'payment_url', 'paid_at',
            ]);
        });
    }
};
