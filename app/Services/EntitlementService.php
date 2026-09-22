<?php

namespace App\Services;

use App\Models\Entitlement;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EntitlementService
{
    /**
     * Grant entitlements for all products in a paid order.
     */
    public function grantForOrder(Order $order): void
    {
        if ($order->status !== 'paid') {
            Log::warning("Attempted to grant entitlement for non-paid order: {$order->id}");

            return;
        }

        if (! $order->user_id) {
            Log::warning("Attempted to grant entitlement for guest order: {$order->id}");

            // Entitlement will be granted when the guest user registers and the order is merged
            return;
        }

        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $this->grant($order->user_id, $item->product_id, $item->product_variation_id, $order->id);
            }
        });
    }

    /**
     * Grant a single entitlement.
     */
    public function grant(int $userId, int $productId, int $productVariationId, ?int $orderId = null): Entitlement
    {
        return Entitlement::updateOrCreate(
            [
                'user_id' => $userId,
                'product_id' => $productId,
                'product_variation_id' => $productVariationId,
            ],
            [
                'order_id' => $orderId,
                'granted_at' => now(),
                'revoked_at' => null, // Reactivate if it was previously revoked
            ]
        );
    }

    /**
     * Revoke a single entitlement.
     */
    public function revoke(int $userId, int $productId, int $productVariationId): void
    {
        $entitlement = Entitlement::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('product_variation_id', $productVariationId)
            ->first();

        if ($entitlement && ! $entitlement->revoked_at) {
            $entitlement->update(['revoked_at' => now()]);
        }
    }

    /**
     * Check if a user has an active entitlement for a product.
     */
    public function check(int $userId, int $productId, ?int $productVariationId = null): bool
    {
        $query = Entitlement::where('user_id', $userId)
            ->where('product_id', $productId)
            ->active();

        if ($productVariationId) {
            $query->where('product_variation_id', $productVariationId);
        }

        return $query->exists();
    }

    /**
     * Merge guest orders matching the user's email into their account and grant entitlements.
     *
     * @return int The number of orders merged
     */
    public function mergeGuestOrders(User $user): int
    {
        $guestOrders = Order::whereNull('user_id')
            ->where('customer_email', $user->email)
            ->get();

        $mergedCount = 0;

        if ($guestOrders->isEmpty()) {
            return $mergedCount;
        }

        DB::transaction(function () use ($user, $guestOrders, &$mergedCount) {
            foreach ($guestOrders as $order) {
                // Assign order to the user
                $order->update(['user_id' => $user->id]);

                // If the order is paid, grant entitlements
                if ($order->status === 'paid') {
                    $this->grantForOrder($order);
                }

                $mergedCount++;
            }
        });

        if ($mergedCount > 0) {
            Log::info("Merged {$mergedCount} guest orders for user {$user->id} ({$user->email})");
        }

        return $mergedCount;
    }
}
