<?php

use App\Models\Coupon;
use App\Models\User;

test('admin can view coupons list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Coupon::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.coupons.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Coupons/Index')
        ->has('coupons.data', 3)
    );
});

test('admin can create a coupon', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.coupons.store'), [
        'code' => 'DISCOUNT50',
        'discount_type' => 'percentage',
        'discount_amount' => 50,
        'max_uses' => 100,
        'valid_until' => now()->addDays(7)->toDateTimeString(),
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.coupons.index'));
    $this->assertDatabaseHas('coupons', [
        'code' => 'DISCOUNT50',
        'discount_type' => 'percentage',
        'discount_amount' => 50,
    ]);
});

test('admin can update a coupon', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $coupon = Coupon::factory()->create([
        'code' => 'OLDCODE',
        'discount_amount' => 10,
    ]);

    $response = $this->actingAs($admin)->put(route('admin.coupons.update', $coupon), [
        'code' => 'NEWCODE',
        'discount_type' => 'fixed',
        'discount_amount' => 20000,
        'max_uses' => 50,
        'is_active' => false,
    ]);

    $response->assertRedirect(route('admin.coupons.index'));
    $this->assertDatabaseHas('coupons', [
        'id' => $coupon->id,
        'code' => 'NEWCODE',
        'discount_type' => 'fixed',
        'discount_amount' => 20000,
        'is_active' => false,
    ]);
});

test('admin can delete a coupon', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $coupon = Coupon::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.coupons.destroy', $coupon));

    $response->assertRedirect(route('admin.coupons.index'));
    $this->assertModelMissing($coupon);
});
