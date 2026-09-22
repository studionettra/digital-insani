<?php

use App\Mail\PaymentSuccessMail;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    Config::set('services.midtrans.server_key', 'test_server_key');

    // Create a product for the order
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
    ]);

    $this->user = User::create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->order = Order::create([
        'user_id' => $this->user->id,
        'order_number' => 'ORD-'.strtoupper(Str::random(8)),
        'customer_name' => 'Test User',
        'customer_email' => 'test@example.com',
        'subtotal' => 100000,
        'total_amount' => 100000,
        'status' => 'pending',
        'external_id' => 'DIGIPROD-TEST-12345',
        'payment_id' => 'midtrans_123',
    ]);

    OrderItem::create([
        'order_id' => $this->order->id,
        'product_id' => $this->product->id,
        'product_variation_id' => $this->variation->id,
        'price' => 100000,
    ]);
});

it('rejects webhook without valid signature', function () {
    $payload = [
        'order_id' => $this->order->external_id,
        'status_code' => '200',
        'gross_amount' => '100000.00',
        'transaction_status' => 'settlement',
        'signature_key' => 'invalid_signature_here',
    ];

    $response = $this->postJson(route('webhook.midtrans'), $payload);

    $response->assertStatus(403)
        ->assertJson(['message' => 'Invalid signature']);

    // Ensure order is not updated
    $this->assertDatabaseHas('orders', [
        'id' => $this->order->id,
        'status' => 'pending',
    ]);
});

it('ignores orders without correct prefix', function () {
    $payload = [
        'order_id' => 'SOME-OTHER-PREFIX-123',
        'status_code' => '200',
        'gross_amount' => '100000.00',
        'transaction_status' => 'settlement',
    ];

    $response = $this->postJson(route('webhook.midtrans'), $payload);

    $response->assertStatus(200)
        ->assertJson(['message' => 'Ignored: not a DIGIPROD order']);
});

it('processes a valid settlement webhook, updates order, grants entitlements, and sends email', function () {
    Mail::fake();

    $orderId = $this->order->external_id;
    $statusCode = '200';
    $grossAmount = '100000.00';
    $serverKey = 'test_server_key';

    // Generate valid signature
    $signature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

    $payload = [
        'order_id' => $orderId,
        'status_code' => $statusCode,
        'gross_amount' => $grossAmount,
        'transaction_status' => 'settlement',
        'signature_key' => $signature,
    ];

    $response = $this->postJson(route('webhook.midtrans'), $payload);

    $response->assertStatus(200)
        ->assertJson(['status' => 'success']);

    // Ensure order is paid
    $this->assertDatabaseHas('orders', [
        'id' => $this->order->id,
        'status' => 'paid',
    ]);

    // Ensure webhook event is logged
    $this->assertDatabaseHas('payment_webhook_events', [
        'external_id' => $orderId,
        'event_type' => 'settlement',
    ]);

    // Ensure entitlements are granted
    $this->assertDatabaseHas('entitlements', [
        'user_id' => $this->user->id,
        'product_id' => $this->product->id,
        'order_id' => $this->order->id,
    ]);

    // Ensure email is sent
    Mail::assertSent(PaymentSuccessMail::class, function ($mail) {
        return $mail->hasTo($this->user->email);
    });
});

it('does not process paid orders again (idempotency)', function () {
    Mail::fake();

    $this->order->update(['status' => 'paid']);

    $orderId = $this->order->external_id;
    $statusCode = '200';
    $grossAmount = '100000.00';
    $serverKey = 'test_server_key';
    $signature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

    $payload = [
        'order_id' => $orderId,
        'status_code' => $statusCode,
        'gross_amount' => $grossAmount,
        'transaction_status' => 'settlement',
        'signature_key' => $signature,
    ];

    $response = $this->postJson(route('webhook.midtrans'), $payload);

    $response->assertStatus(200)
        ->assertJson(['message' => 'Already paid']);

    // Email should not be sent again
    Mail::assertNotSent(PaymentSuccessMail::class);
});
