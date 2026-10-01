<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductBundle;
use App\Models\ProductVariation;
use App\Models\User;
use App\Services\MidtransService;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->category = Category::factory()->create(['is_active' => true]);

    $this->product1 = Product::factory()->create([
        'category_id' => $this->category->id,
        'is_active' => true,
        'title' => 'Starter Kit Modern',
    ]);
    $this->variation1 = ProductVariation::factory()->create([
        'product_id' => $this->product1->id,
        'price' => 100000,
    ]);

    $this->product2 = Product::factory()->create([
        'category_id' => $this->category->id,
        'is_active' => true,
        'title' => 'UI Kit Dashboard',
    ]);
    $this->variation2 = ProductVariation::factory()->create([
        'product_id' => $this->product2->id,
        'price' => 200000,
    ]);
});

test('active bundle is displayed on product show page with correct pricing', function () {
    $bundle = ProductBundle::factory()->create([
        'name' => 'Paket Kombo Developer',
        'discount_percentage' => 20,
        'is_active' => true,
    ]);
    $bundle->products()->attach([$this->product1->id, $this->product2->id]);

    $response = $this->get(route('products.show', $this->product1->slug));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Products/Show')
        ->has('bundles', 1)
        ->where('bundles.0.id', $bundle->id)
        ->where('bundles.0.discount_percentage', 20)
        ->where('bundles.0.regular_price', 300000)
        ->where('bundles.0.discounted_price', 240000)
        ->where('bundles.0.savings_amount', 60000)
    );
});

test('inactive bundle or bundle with inactive product is not shown on product page', function () {
    $inactiveBundle = ProductBundle::factory()->create([
        'is_active' => false,
    ]);
    $inactiveBundle->products()->attach([$this->product1->id, $this->product2->id]);

    $response = $this->get(route('products.show', $this->product1->slug));
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Products/Show')
        ->has('bundles', 0)
    );

    // If bundle is active but one product is inactive
    $bundle2 = ProductBundle::factory()->create(['is_active' => true]);
    $inactiveProduct = Product::factory()->create(['is_active' => false]);
    $bundle2->products()->attach([$this->product1->id, $inactiveProduct->id]);

    $response2 = $this->get(route('products.show', $this->product1->slug));
    $response2->assertInertia(fn (Assert $page) => $page
        ->component('Products/Show')
        ->has('bundles', 0)
    );
});

test('guest or user can add product bundle to cart in one click', function () {
    $bundle = ProductBundle::factory()->create([
        'discount_percentage' => 20,
        'is_active' => true,
    ]);
    $bundle->products()->attach([$this->product1->id, $this->product2->id]);

    $response = $this->post(route('cart.bundle'), [
        'bundle_id' => $bundle->id,
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseCount('cart_items', 2);
    $this->assertDatabaseHas('cart_items', [
        'product_id' => $this->product1->id,
        'bundle_id' => $bundle->id,
    ]);
    $this->assertDatabaseHas('cart_items', [
        'product_id' => $this->product2->id,
        'bundle_id' => $bundle->id,
    ]);
});

test('cannot add inactive bundle to cart', function () {
    $bundle = ProductBundle::factory()->create([
        'is_active' => false,
    ]);
    $bundle->products()->attach([$this->product1->id, $this->product2->id]);

    $response = $this->post(route('cart.bundle'), [
        'bundle_id' => $bundle->id,
    ]);

    $response->assertSessionHas('error');
    $this->assertDatabaseCount('cart_items', 0);
});

test('checkout accurately applies bundle discount percentage to subtotal and order items', function () {
    $user = User::factory()->create();
    $bundle = ProductBundle::factory()->create([
        'discount_percentage' => 20,
        'is_active' => true,
    ]);
    $bundle->products()->attach([$this->product1->id, $this->product2->id]);

    // Add bundle items to cart
    $this->actingAs($user)->post(route('cart.bundle'), ['bundle_id' => $bundle->id]);

    $mockMidtrans = Mockery::mock(MidtransService::class);
    $mockMidtrans->shouldReceive('createTransaction')->once()->andReturn([
        'snap_token' => 'snap_bundle_test',
        'payment_url' => 'https://app.sandbox.midtrans.com/snap/v2/vtweb/test_bundle',
        'payment_id' => 'DIGIPROD-BUNDLE-123',
    ]);
    app()->instance(MidtransService::class, $mockMidtrans);

    // Checkout
    $response = $this->actingAs($user)->post(route('checkout.store'));

    $response->assertRedirect('https://app.sandbox.midtrans.com/snap/v2/vtweb/test_bundle');

    // Normal price: 100k + 200k = 300k. 20% discount = 240k.
    $order = Order::latest()->first();
    expect($order)->not->toBeNull()
        ->and((float) $order->subtotal)->toBe((float) 240000)
        ->and((float) $order->total_amount)->toBe((float) 240000);

    // Order items should have bundle_id and discounted price
    $item1 = OrderItem::where('order_id', $order->id)->where('product_id', $this->product1->id)->first();
    $item2 = OrderItem::where('order_id', $order->id)->where('product_id', $this->product2->id)->first();

    expect($item1->bundle_id)->toBe($bundle->id)
        ->and((float) $item1->price)->toBe((float) 80000) // 100k - 20%
        ->and($item2->bundle_id)->toBe($bundle->id)
        ->and((float) $item2->price)->toBe((float) 160000); // 200k - 20%
});

test('admin can update flash sale settings and they are shared to frontend props', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    $futureDate = now()->addDays(3)->format('Y-m-d\TH:i');

    $response = $this->actingAs($admin)->post(route('admin.settings.update'), [
        'site_name' => 'Digital Insani Store',
        'support_email' => 'support@digitalinsani.id',
        'flash_sale_active' => true,
        'flash_sale_title' => '⚡ Pesta Diskon Kilat Akhir Pekan!',
        'flash_sale_discount_percentage' => 35,
        'flash_sale_ends_at' => $futureDate,
    ]);

    $response->assertSessionHas('success');

    // Visit home page and verify Inertia props
    $homeResponse = $this->get(route('home'));
    $homeResponse->assertInertia(fn (Assert $page) => $page
        ->where('site_settings.flash_sale.is_active', true)
        ->where('site_settings.flash_sale.title', '⚡ Pesta Diskon Kilat Akhir Pekan!')
        ->where('site_settings.flash_sale.discount_percentage', 35)
        ->where('site_settings.flash_sale.ends_at', $futureDate)
    );
});
