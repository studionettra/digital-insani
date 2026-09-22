<?php

use App\Jobs\SendProductUpdateNotification;
use App\Models\Product;
use App\Models\ProductUpdate;
use App\Models\User;
use Illuminate\Support\Facades\Queue;

test('admin can view product updates list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $product = Product::factory()->create();
    ProductUpdate::factory()->count(3)->create(['product_id' => $product->id]);

    $response = $this->actingAs($admin)->get(route('admin.product-updates.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/ProductUpdates/Index')
        ->has('updates.data', 3)
    );
});

test('admin can create a product update without notifying users', function () {
    Queue::fake();

    $admin = User::factory()->create(['role' => 'admin']);
    $product = Product::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.product-updates.store'), [
        'product_id' => $product->id,
        'version' => '2.0.0',
        'changelog' => '- Added feature A',
        'notify_users' => false,
    ]);

    $response->assertRedirect(route('admin.product-updates.index'));

    $this->assertDatabaseHas('product_updates', [
        'product_id' => $product->id,
        'version' => '2.0.0',
        'is_notified' => false,
    ]);

    Queue::assertNotPushed(SendProductUpdateNotification::class);
});

test('admin can create a product update and notify users', function () {
    Queue::fake();

    $admin = User::factory()->create(['role' => 'admin']);
    $product = Product::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.product-updates.store'), [
        'product_id' => $product->id,
        'version' => '2.1.0',
        'changelog' => '- Added feature B',
        'notify_users' => true,
    ]);

    $response->assertRedirect(route('admin.product-updates.index'));

    $this->assertDatabaseHas('product_updates', [
        'product_id' => $product->id,
        'version' => '2.1.0',
        'is_notified' => true,
    ]);

    Queue::assertPushed(SendProductUpdateNotification::class);
});

test('admin can delete a product update', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $product = Product::factory()->create();
    $update = ProductUpdate::factory()->create(['product_id' => $product->id]);

    $response = $this->actingAs($admin)->delete(route('admin.product-updates.destroy', $update));

    $response->assertRedirect(route('admin.product-updates.index'));
    $this->assertModelMissing($update);
});
