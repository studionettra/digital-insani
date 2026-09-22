<?php

use App\Models\Order;
use App\Services\EntitlementService;

Order::where('status', 'paid')->each(function ($order) {
    app(EntitlementService::class)->grantForOrder($order);
});
