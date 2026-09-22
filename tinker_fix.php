<?php
App\Models\Order::where('status', 'paid')->each(function($order) {
    app(\App\Services\EntitlementService::class)->grantForOrder($order);
});
