<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariation;

test('guest can download within 24 hours of payment', function () {
    $order = Order::factory()->create([
        'status' => 'paid',
        'paid_at' => now()->subHours(10), // 10 hours ago
    ]);
    $variation = ProductVariation::factory()->create(['delivery_type' => 'url', 'file_url' => 'https://example.com/file']);
    $item = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_variation_id' => $variation->id,
    ]);

    $response = $this->get(route('guest.download', [
        'order' => $order->id,
        'item' => $item->id,
        'token' => $order->access_token,
    ]));

    $response->assertRedirect('https://example.com/file');
});

test('guest cannot download after 24 hours of payment', function () {
    $order = Order::factory()->create([
        'status' => 'paid',
        'paid_at' => now()->subHours(25), // 25 hours ago
    ]);
    $variation = ProductVariation::factory()->create(['delivery_type' => 'url', 'file_url' => 'https://example.com/file']);
    $item = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_variation_id' => $variation->id,
    ]);

    $response = $this->get(route('guest.download', [
        'order' => $order->id,
        'item' => $item->id,
        'token' => $order->access_token,
    ]));

    // It should redirect back with an error
    $response->assertRedirect();
    $response->assertSessionHas('error');
});
