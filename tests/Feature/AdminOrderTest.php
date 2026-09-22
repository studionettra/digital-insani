<?php

use App\Models\Order;
use App\Models\User;

test('admin can view orders list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Order::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.orders.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Orders/Index')
        ->has('orders.data', 3)
    );
});

test('non-admin cannot view orders list', function () {
    $user = User::factory()->create();
    Order::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('admin.orders.index'));

    $response->assertRedirect(route('member.dashboard'));
});

test('admin can filter orders by status', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Order::factory()->count(2)->create(['status' => 'paid']);
    Order::factory()->count(3)->create(['status' => 'pending']);

    $response = $this->actingAs($admin)->get(route('admin.orders.index', ['status' => 'paid']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Orders/Index')
        ->has('orders.data', 2)
    );
});

test('admin can view order details', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $order = Order::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.orders.show', $order));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Orders/Show')
        ->has('order.id')
    );
});
