<?php

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Coupon>
 */
class CouponFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => mb_strtoupper(mb_substr($this->faker->unique()->word(), 0, 5).$this->faker->numberBetween(10, 99)),
            'discount_type' => 'fixed',
            'discount_amount' => $this->faker->numberBetween(10000, 50000),
            'max_uses' => $this->faker->numberBetween(10, 100),
            'used_count' => 0,
            'is_active' => true,
            'valid_until' => $this->faker->dateTimeBetween('now', '+1 month'),
        ];
    }
}
