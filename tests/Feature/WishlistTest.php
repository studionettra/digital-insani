<?php

use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\User;
use App\Models\Wishlist;

test('authenticated user can add product to wishlist via toggle', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true]);

    $response = $this->actingAs($user)->postJson(route('wishlist.toggle', $product));

    $response->assertOk();
    $response->assertJson([
        'status' => 'added',
        'in_wishlist' => true,
        'count' => 1,
    ]);

    $this->assertDatabaseHas('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);
});

test('authenticated user can remove product from wishlist via toggle', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true]);

    Wishlist::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = $this->actingAs($user)->postJson(route('wishlist.toggle', $product));

    $response->assertOk();
    $response->assertJson([
        'status' => 'removed',
        'in_wishlist' => false,
        'count' => 0,
    ]);

    $this->assertDatabaseMissing('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);
});

test('cannot toggle inactive product into wishlist', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => false]);

    $response = $this->actingAs($user)->postJson(route('wishlist.toggle', $product));

    $response->assertNotFound();
});

test('authenticated user can view wishlist page with saved products', function () {
    $user = User::factory()->create();
    $product1 = Product::factory()->create(['is_active' => true]);
    $product2 = Product::factory()->create(['is_active' => true]);
    ProductVariation::factory()->create(['product_id' => $product1->id]);
    ProductVariation::factory()->create(['product_id' => $product2->id]);

    Wishlist::create(['user_id' => $user->id, 'product_id' => $product1->id]);

    $response = $this->actingAs($user)->get(route('wishlist.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Wishlist/Index')
        ->has('products', 1)
        ->where('products.0.id', $product1->id)
    );
});

test('guest can view wishlist page with products provided via ids parameter', function () {
    $product1 = Product::factory()->create(['is_active' => true]);
    $product2 = Product::factory()->create(['is_active' => true]);
    ProductVariation::factory()->create(['product_id' => $product1->id]);
    ProductVariation::factory()->create(['product_id' => $product2->id]);

    $response = $this->get(route('wishlist.index', ['ids' => "{$product1->id},{$product2->id}"]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Wishlist/Index')
        ->has('products', 2)
    );
});

test('authenticated user can sync guest wishlist ids', function () {
    $user = User::factory()->create();
    $product1 = Product::factory()->create(['is_active' => true]);
    $product2 = Product::factory()->create(['is_active' => true]);

    $response = $this->actingAs($user)->postJson(route('wishlist.sync'), [
        'ids' => [$product1->id, $product2->id],
    ]);

    $response->assertOk();
    $response->assertJson([
        'status' => 'synced',
        'count' => 2,
    ]);

    $this->assertDatabaseHas('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product1->id,
    ]);
    $this->assertDatabaseHas('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product2->id,
    ]);
});

test('wishlist ids endpoint returns current user wishlist ids', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true]);
    Wishlist::create(['user_id' => $user->id, 'product_id' => $product->id]);

    $response = $this->actingAs($user)->getJson(route('wishlist.ids'));

    $response->assertOk();
    $response->assertJson([
        'ids' => [$product->id],
    ]);
});
