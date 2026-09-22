<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'order_number' => 'ORD-'.strtoupper(Str::random(10)),
            'customer_name' => $this->faker->name(),
            'customer_email' => $this->faker->safeEmail(),
            'customer_phone' => $this->faker->phoneNumber(),
            'status' => 'pending',
            'subtotal' => 50000,
            'discount_amount' => 0,
            'total_amount' => 50000,
            'payment_method' => 'qris',
            'access_token' => Str::random(40),
            'paid_at' => null,
        ];
    }
}
