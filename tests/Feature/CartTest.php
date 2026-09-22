<?php

use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\User;

it('can view cart page when authenticated', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/cart');

    $response->assertStatus(200);
});

it('can view cart page when guest', function () {
    $response = $this->get('/cart');

    $response->assertStatus(200);
});

it('can add product to cart as guest', function () {
    $product = Product::factory()->create();
    $variation = ProductVariation::create([
        'product_id' => $product->id,
        'name' => 'Basic',
        'price' => 100000,
    ]);

    $response = $this->post('/cart', [
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('cart_items', [
        'user_id' => null,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
        'quantity' => 1,
    ]);
});

it('can add product to cart', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $variation = ProductVariation::create([
        'product_id' => $product->id,
        'name' => 'Basic',
        'price' => 100000,
    ]);

    $response = $this->actingAs($user)->post('/cart', [
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('cart_items', [
        'user_id' => $user->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
        'quantity' => 1,
    ]);
});

it('increments quantity when adding same product and variation', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $variation = ProductVariation::create([
        'product_id' => $product->id,
        'name' => 'Basic',
        'price' => 100000,
    ]);

    $this->actingAs($user)->post('/cart', [
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
    ]);

    $this->actingAs($user)->post('/cart', [
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'user_id' => $user->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
        'quantity' => 2,
    ]);
});

it('can remove product from cart', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $variation = ProductVariation::create([
        'product_id' => $product->id,
        'name' => 'Basic',
        'price' => 100000,
    ]);

    $cartItem = CartItem::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
        'quantity' => 1,
    ]);

    $response = $this->actingAs($user)->delete("/cart/{$cartItem->id}");

    $response->assertRedirect();
    $this->assertDatabaseMissing('cart_items', [
        'id' => $cartItem->id,
    ]);
});
