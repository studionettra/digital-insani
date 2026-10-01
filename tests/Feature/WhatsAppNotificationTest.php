<?php

use App\Jobs\SendWhatsAppOrderNotification;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\SiteSetting;
use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    $this->category = Category::factory()->create(['is_active' => true]);
    $this->product = Product::factory()->create([
        'category_id' => $this->category->id,
        'title' => 'Landing Page Template Pro',
        'is_active' => true,
    ]);
    $this->variation = ProductVariation::factory()->create([
        'product_id' => $this->product->id,
        'name' => 'Lisensi Komersial',
        'price' => 150000,
    ]);

    $this->order = Order::factory()->create([
        'order_number' => 'ORD-TEST1234',
        'customer_name' => 'Budi Santoso',
        'customer_email' => 'budi@example.com',
        'customer_phone' => '081234567890',
        'total_amount' => 150000,
        'status' => 'pending',
        'access_token' => 'test-token-uuid',
    ]);

    OrderItem::create([
        'order_id' => $this->order->id,
        'product_id' => $this->product->id,
        'product_variation_id' => $this->variation->id,
        'price' => 150000,
        'quantity' => 1,
    ]);
});

test('whatsapp service normalizes indonesian phone numbers correctly', function () {
    $service = app(WhatsAppService::class);

    expect($service->normalizePhoneNumber('081234567890'))->toBe('6281234567890')
        ->and($service->normalizePhoneNumber('+62 812-3456-7890'))->toBe('6281234567890')
        ->and($service->normalizePhoneNumber('81234567890'))->toBe('6281234567890')
        ->and($service->normalizePhoneNumber('6281234567890'))->toBe('6281234567890');
});

test('whatsapp service renders template with order tokens', function () {
    $service = app(WhatsAppService::class);

    $rendered = $service->renderTemplate($this->order);

    expect($rendered)
        ->toContain('Budi Santoso')
        ->toContain('ORD-TEST1234')
        ->toContain('150.000')
        ->toContain('Landing Page Template Pro')
        ->toContain('Lisensi Komersial')
        ->toContain('/checkout/status/'.$this->order->id.'?token=test-token-uuid')
        ->toContain('/orders/'.$this->order->id.'/invoice?token=test-token-uuid');
});

test('whatsapp service sends post request to fonnte api when enabled', function () {
    Http::fake([
        'https://api.fonnte.com/send' => Http::response([
            'status' => true,
            'message' => 'Message sent successfully',
        ], 200),
    ]);

    SiteSetting::set('whatsapp_notification_active', '1');
    SiteSetting::set('whatsapp_api_token', 'sample-fonnte-token-123');
    SiteSetting::set('whatsapp_provider', 'fonnte');

    $service = app(WhatsAppService::class);
    $result = $service->sendMessage('081234567890', 'Halo Budi, pesanan Anda lunas.');

    expect($result['success'])->toBeTrue()
        ->and($result['message'])->toContain('Fonnte');

    Http::assertSent(function ($request) {
        return $request->url() === 'https://api.fonnte.com/send'
            && $request->header('Authorization')[0] === 'sample-fonnte-token-123'
            && $request['target'] === '6281234567890'
            && $request['countryCode'] === '62';
    });
});

test('midtrans webhook markAsPaid dispatches SendWhatsAppOrderNotification job', function () {
    Queue::fake();

    $serverKey = config('services.midtrans.server_key') ?: 'test-server-key';
    config(['services.midtrans.server_key' => $serverKey]);

    $externalId = 'DIGIPROD-'.$this->order->id.'-1234567';
    $this->order->update(['external_id' => $externalId]);

    $statusCode = '200';
    $grossAmount = '150000.00';
    $signatureKey = hash('sha512', $externalId.$statusCode.$grossAmount.$serverKey);

    $response = $this->postJson(route('webhook.midtrans'), [
        'order_id' => $externalId,
        'status_code' => $statusCode,
        'gross_amount' => $grossAmount,
        'signature_key' => $signatureKey,
        'transaction_status' => 'settlement',
        'payment_type' => 'qris',
    ]);

    $response->assertOk();

    Queue::assertPushed(SendWhatsAppOrderNotification::class, function ($job) {
        return $job->orderId === $this->order->id;
    });
});

test('send whatsapp order notification job skips when notification is disabled', function () {
    Http::fake();

    SiteSetting::set('whatsapp_notification_active', '0');

    $job = new SendWhatsAppOrderNotification($this->order->id);
    $job->handle(app(WhatsAppService::class));

    Http::assertNothingSent();
});

test('admin can update whatsapp settings and send test message', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    Http::fake([
        'https://api.fonnte.com/send' => Http::response([
            'status' => true,
            'message' => 'Test message sent',
        ], 200),
    ]);

    SiteSetting::set('whatsapp_notification_active', '1');
    SiteSetting::set('whatsapp_api_token', 'my-admin-token');
    SiteSetting::set('whatsapp_provider', 'fonnte');

    $response = $this->actingAs($admin)->post(route('admin.settings.test-whatsapp'), [
        'phone' => '081298765432',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    Http::assertSent(function ($request) {
        return $request->url() === 'https://api.fonnte.com/send'
            && $request['target'] === '6281298765432';
    });
});
