<?php

use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\User;
use App\Services\MidtransService;

it('cannot checkout when cart is empty', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/checkout');

    $response->assertRedirect();
    $this->assertDatabaseCount('orders', 0);
});

it('can checkout with items in cart', function () {
    $user = User::factory()->create();
    $product1 = Product::factory()->create();
    $product2 = Product::factory()->create();

    $var1 = ProductVariation::create(['product_id' => $product1->id, 'name' => 'V1', 'price' => 10000]);
    $var2 = ProductVariation::create(['product_id' => $product2->id, 'name' => 'V2', 'price' => 20000]);

    CartItem::create(['user_id' => $user->id, 'product_id' => $product1->id, 'product_variation_id' => $var1->id, 'quantity' => 1]);
    CartItem::create(['user_id' => $user->id, 'product_id' => $product2->id, 'product_variation_id' => $var2->id, 'quantity' => 2]);

    $mockMidtrans = Mockery::mock(MidtransService::class);
    $mockMidtrans->shouldReceive('createTransaction')->once()->andReturn([
        'snap_token' => 'snap_test_123',
        'payment_url' => 'https://app.sandbox.midtrans.com/snap/v2/vtweb/test_123',
        'payment_id' => 'DIGIPROD-1-123456',
    ]);
    app()->instance(MidtransService::class, $mockMidtrans);

    $response = $this->actingAs($user)->post('/checkout');

    $response->assertRedirect('https://app.sandbox.midtrans.com/snap/v2/vtweb/test_123');

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'total_amount' => 50000,
        'status' => 'pending',
    ]);

    $order = Order::where('user_id', $user->id)->first();

    $this->assertDatabaseHas('order_items', [
        'order_id' => $order->id,
        'product_id' => $product1->id,
        'product_variation_id' => $var1->id,
        'price' => 10000,
    ]);

    $this->assertDatabaseHas('order_items', [
        'order_id' => $order->id,
        'product_id' => $product2->id,
        'product_variation_id' => $var2->id,
        'price' => 20000,
    ]);

    $this->assertDatabaseCount('cart_items', 0);
});
