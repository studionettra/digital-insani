<?php

namespace App\Listeners;

use App\Models\CartItem;
use App\Services\EntitlementService;
use Illuminate\Auth\Events\Registered;

class LinkGuestOrdersToUser
{
    /**
     * Create the event listener.
     */
    public function __construct(
        public EntitlementService $entitlementService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        $user = $event->user;

        // Merge guest orders and grant entitlements for paid orders
        $this->entitlementService->mergeGuestOrders($user);

        // Also update any guest cart items if they exist
        $sessionId = session()->getId();
        if ($sessionId) {
            CartItem::whereNull('user_id')
                ->where('session_id', $sessionId)
                ->update([
                    'user_id' => $user->id,
                ]);
        }
    }
}
