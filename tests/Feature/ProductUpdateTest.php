<?php

use App\Jobs\SendProductUpdateNotification;
use App\Mail\ProductUpdatedEmail;
use App\Models\Entitlement;
use App\Models\Product;
use App\Models\ProductUpdate;
use App\Models\ProductVariation;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

it('displays product updates in member product show page', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);
    $entitlement = Entitlement::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
        'granted_at' => now(),
    ]);

    $update = ProductUpdate::create([
        'product_id' => $product->id,
        'version' => 'v1.1',
        'changelog' => 'Added new features',
        'published_at' => now()->subDay(),
    ]);

    $this->actingAs($user)
        ->get(route('member.products.show', $entitlement->id))
        ->assertOk()
        ->assertSee('v1.1')
        ->assertSee('Added new features');
});

it('can view updates feed page', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);
    Entitlement::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
        'granted_at' => now(),
    ]);

    ProductUpdate::create([
        'product_id' => $product->id,
        'version' => 'v2.0',
        'changelog' => 'Major update',
        'published_at' => now()->subHour(),
    ]);

    $this->actingAs($user)
        ->get(route('member.updates.index'))
        ->assertOk()
        ->assertSee('v2.0')
        ->assertSee('Major update');
});

it('dispatches job and sends email when notifying users', function () {
    Mail::fake();

    $user = User::factory()->create();
    $product = Product::factory()->create();
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);
    Entitlement::create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'product_variation_id' => $variation->id,
        'granted_at' => now(),
    ]);

    $update = ProductUpdate::create([
        'product_id' => $product->id,
        'version' => 'v3.0',
        'changelog' => 'Email test',
        'email_message' => 'Hello user',
        'published_at' => now(),
    ]);

    $job = new SendProductUpdateNotification($update);
    $job->handle();

    Mail::assertSent(ProductUpdatedEmail::class, function ($mail) use ($user, $update) {
        return $mail->hasTo($user->email) &&
               $mail->update->id === $update->id;
    });
});
