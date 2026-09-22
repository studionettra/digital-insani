<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\CouponUsage;

class CouponService
{
    /**
     * Validate and retrieve a coupon by code.
     *
     * @return array|null Returns array with 'coupon' and 'discount' if valid, null otherwise.
     */
    public function validate(string $code, float $subtotal = 0): ?array
    {
        $coupon = Coupon::where('code', $code)->first();

        if (! $coupon || ! $coupon->isValid()) {
            return null;
        }

        $discount = $this->calculateDiscount($coupon, $subtotal);

        return [
            'coupon' => $coupon,
            'discount' => $discount,
        ];
    }

    /**
     * Apply coupon to a subtotal and return final total.
     */
    public function apply(Coupon $coupon, float $subtotal): float
    {
        $discount = $this->calculateDiscount($coupon, $subtotal);
        $total = $subtotal - $discount;

        return max($total, 0); // Ensure total does not go below 0
    }

    /**
     * Calculate discount amount based on type.
     */
    private function calculateDiscount(Coupon $coupon, float $subtotal): float
    {
        if ($coupon->discount_type === 'percentage') {
            return $subtotal * ($coupon->discount_amount / 100);
        }

        return $coupon->discount_amount;
    }

    /**
     * Record coupon usage.
     */
    public function recordUsage(Coupon $coupon, ?int $userId, int $orderId): void
    {
        CouponUsage::create([
            'coupon_id' => $coupon->id,
            'user_id' => $userId,
            'order_id' => $orderId,
        ]);

        $coupon->increment('used_count');
    }
}
