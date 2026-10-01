<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\User;

test('guest can download invoice with valid access token in path parameter', function () {
    $product = Product::factory()->create();
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);

    $order = Order::factory()->create([
        'user_id' => null,
        'status' => 'paid',
        'paid_at' => now(),
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
        'price' => 50000,
    ]);

    $response = $this->get(route('checkout.invoice', [
        'order' => $order->id,
        'token' => $order->access_token,
    ]));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
    $this->assertStringContainsString("Invoice-{$order->order_number}.pdf", $response->headers->get('content-disposition'));
});

test('guest can download invoice with valid access token in query parameter', function () {
    $product = Product::factory()->create();
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);

    $order = Order::factory()->create([
        'user_id' => null,
        'status' => 'paid',
        'paid_at' => now(),
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
    ]);

    $response = $this->get(route('checkout.invoice', [
        'order' => $order->id,
    ]).'?token='.$order->access_token);

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});

test('guest cannot download invoice with invalid access token', function () {
    $order = Order::factory()->create([
        'user_id' => null,
        'status' => 'paid',
    ]);

    $response = $this->get(route('checkout.invoice', [
        'order' => $order->id,
        'token' => 'invalid-token-123',
    ]));

    $response->assertForbidden();
});

test('cannot download invoice if order is not paid', function () {
    $order = Order::factory()->create([
        'user_id' => null,
        'status' => 'pending',
    ]);

    $response = $this->get(route('checkout.invoice', [
        'order' => $order->id,
        'token' => $order->access_token,
    ]));

    $response->assertStatus(400);
});

test('authenticated owner can download invoice without token parameter', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'paid',
        'paid_at' => now(),
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
    ]);

    $response = $this->actingAs($user)->get(route('checkout.invoice', [
        'order' => $order->id,
    ]));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});

test('unauthorized user cannot download another users invoice without valid token', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $order = Order::factory()->create([
        'user_id' => $owner->id,
        'status' => 'paid',
    ]);

    $response = $this->actingAs($otherUser)->get(route('checkout.invoice', [
        'order' => $order->id,
    ]));

    $response->assertForbidden();
});
