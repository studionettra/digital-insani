<?php

namespace App\Listeners;

use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Auth\Events\Registered;

class LinkGuestOrdersToUser
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        $user = $event->user;

        // Find all guest orders matching email or phone
        Order::whereNull('user_id')
            ->where(function ($query) use ($user) {
                $query->where('customer_email', $user->email);
                if (! empty($user->phone)) {
                    $query->orWhere('customer_phone', $user->phone);
                }
            })
            ->update([
                'user_id' => $user->id,
            ]);

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
