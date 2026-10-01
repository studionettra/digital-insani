<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\Review;
use App\Models\User;

test('verified buyer can submit review for purchased product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'paid',
        'paid_at' => now(),
    ]);

    $item = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
    ]);

    $response = $this->actingAs($user)->post(route('reviews.store'), [
        'order_item_id' => $item->id,
        'rating' => 5,
        'comment' => 'Template ini sangat membantu mempercepat pembuatan proyek!',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('reviews', [
        'user_id' => $user->id,
        'order_item_id' => $item->id,
        'product_id' => $product->id,
        'rating' => 5,
        'comment' => 'Template ini sangat membantu mempercepat pembuatan proyek!',
        'is_verified_buyer' => true,
    ]);
});

test('unverified user cannot submit review for another users order', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $product = Product::factory()->create();
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);

    $order = Order::factory()->create([
        'user_id' => $owner->id,
        'status' => 'paid',
    ]);

    $item = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
    ]);

    $response = $this->actingAs($stranger)->post(route('reviews.store'), [
        'order_item_id' => $item->id,
        'rating' => 5,
        'comment' => 'Mencoba submit review tanpa membeli.',
    ]);

    $response->assertForbidden();
    $this->assertDatabaseMissing('reviews', ['order_item_id' => $item->id]);
});

test('cannot submit review for pending or unpaid order', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
    ]);

    $item = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
    ]);

    $response = $this->actingAs($user)->post(route('reviews.store'), [
        'order_item_id' => $item->id,
        'rating' => 5,
        'comment' => 'Ulasan order pending.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');
    $this->assertDatabaseMissing('reviews', ['order_item_id' => $item->id]);
});

test('cannot submit duplicate review for the same order item', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'paid',
    ]);

    $item = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
    ]);

    Review::factory()->create([
        'user_id' => $user->id,
        'order_item_id' => $item->id,
        'product_id' => $product->id,
    ]);

    $response = $this->actingAs($user)->post(route('reviews.store'), [
        'order_item_id' => $item->id,
        'rating' => 4,
        'comment' => 'Ulasan kedua kali untuk item yang sama.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');
    $this->assertEquals(1, Review::where('order_item_id', $item->id)->count());
});

test('guest can submit review with valid access token', function () {
    $product = Product::factory()->create();
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);

    $order = Order::factory()->create([
        'user_id' => null,
        'status' => 'paid',
        'customer_name' => 'Tamu Digital',
    ]);

    $item = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
    ]);

    $response = $this->post(route('reviews.store'), [
        'order_item_id' => $item->id,
        'token' => $order->access_token,
        'rating' => 5,
        'comment' => 'Pembeli tamu juga bisa mengulas dengan token valid.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('reviews', [
        'order_item_id' => $item->id,
        'customer_name' => 'Tamu Digital',
        'rating' => 5,
        'is_verified_buyer' => true,
    ]);
});

test('rating must be between 1 and 5 and comment is required', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'paid',
    ]);

    $item = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
    ]);

    $response = $this->actingAs($user)->post(route('reviews.store'), [
        'order_item_id' => $item->id,
        'rating' => 6, // invalid
        'comment' => 'Hi', // too short
    ]);

    $response->assertSessionHasErrors(['rating', 'comment']);
});

test('admin can toggle review approval status and delete review', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $review = Review::factory()->create(['is_approved' => true]);

    // Toggle approval
    $response = $this->actingAs($admin)->patch(route('admin.reviews.toggle', $review));
    $response->assertRedirect();
    $this->assertFalse($review->fresh()->is_approved);

    // Delete review
    $response = $this->actingAs($admin)->delete(route('admin.reviews.destroy', $review));
    $response->assertRedirect();
    $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
});
