<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\User;
use App\Services\EntitlementService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('merges guest orders on user registration and grants entitlements', function () {
    $category = Category::create([
        'name' => 'E-Book',
        'slug' => 'e-book',
    ]);

    $product = Product::create([
        'category_id' => $category->id,
        'title' => 'Test Product',
        'slug' => 'test-product',
        'description' => 'Test',
        'status' => 'published',
    ]);

    $variation = ProductVariation::create([
        'product_id' => $product->id,
        'name' => 'Basic',
        'price' => 100000,
    ]);

    $order = Order::create([
        'order_number' => 'TEST-001',
        'customer_name' => 'Guest User',
        'customer_email' => 'guest@example.com',
        'customer_phone' => '08123456789',
        'subtotal' => 100000,
        'total_amount' => 100000,
        'status' => 'paid',
        'paid_at' => now(),
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
        'price' => 100000,
    ]);

    $user = User::create([
        'name' => 'Registered Guest',
        'email' => 'guest@example.com',
        'password' => bcrypt('password'),
    ]);

    $service = app(EntitlementService::class);
    $merged = $service->mergeGuestOrders($user);

    expect($merged)->toBe(1);

    $order->refresh();
    expect($order->user_id)->toBe($user->id);

    $hasEntitlement = $service->check($user->id, $product->id);
    expect($hasEntitlement)->toBeTrue();
});
