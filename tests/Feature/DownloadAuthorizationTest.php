<?php

use App\Models\Category;
use App\Models\Entitlement;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->category = Category::create([
        'name' => 'E-Book',
        'slug' => 'e-book',
    ]);

    $this->product = Product::create([
        'category_id' => $this->category->id,
        'title' => 'Test Product',
        'slug' => 'test-product',
        'description' => 'Test',
        'status' => 'published',
    ]);

    $this->variation = ProductVariation::create([
        'product_id' => $this->product->id,
        'name' => 'Basic',
        'price' => 100000,
        'file_path' => 'google_drive_file_id_123',
    ]);

    $this->user = User::create([
        'name' => 'Authorized User',
        'email' => 'auth@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->otherUser = User::create([
        'name' => 'Other User',
        'email' => 'other@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->order = Order::create([
        'user_id' => $this->user->id,
        'order_number' => 'ORD-TEST-1',
        'customer_name' => 'Authorized User',
        'customer_email' => 'auth@example.com',
        'subtotal' => 100000,
        'total_amount' => 100000,
        'status' => 'paid',
    ]);

    $this->entitlement = Entitlement::create([
        'user_id' => $this->user->id,
        'product_id' => $this->product->id,
        'product_variation_id' => $this->variation->id,
        'order_id' => $this->order->id,
        'status' => 'active',
        'download_count' => 0,
    ]);
});

it('redirects guest to login when trying to download', function () {
    $response = $this->get(route('member.products.download', $this->entitlement->id));

    $response->assertRedirect(route('login'));
});

it('returns 404 if authenticated user tries to download an entitlement they do not own', function () {
    $response = $this->actingAs($this->otherUser)
        ->get(route('member.products.download', $this->entitlement->id));

    // It returns 404 because of firstOrFail() with where('user_id', $user->id)
    $response->assertStatus(404);
});

it('prevents download if download count limit is reached', function () {
    $this->entitlement->update(['download_count' => 5]);

    Storage::fake('google');

    $response = $this->actingAs($this->user)
        ->get(route('member.products.download', $this->entitlement->id));

    $response->assertRedirect()
        ->assertSessionHas('error', 'Batas maksimal download (5 kali) telah tercapai untuk produk ini.');
});

it('successfully downloads if user owns the entitlement and file exists', function () {
    Storage::fake('google');

    // Simulate file existing in Google Drive fake disk
    Storage::disk('google')->put('google_drive_file_id_123', 'fake content');

    $response = $this->actingAs($this->user)
        ->get(route('member.products.download', $this->entitlement->id));

    $response->assertStatus(200);

    $this->entitlement->refresh();
    expect($this->entitlement->download_count)->toBe(1);
});

it('returns error if file does not exist in Google Drive', function () {
    Storage::fake('google');

    // We intentionally DO NOT put the file in the fake disk to trigger exists() check failure

    $response = $this->actingAs($this->user)
        ->get(route('member.products.download', $this->entitlement->id));

    $response->assertRedirect()
        ->assertSessionHas('error', 'File tidak ditemukan di sistem kami.');
});
