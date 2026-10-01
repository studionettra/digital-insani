<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
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
            'order_item_id' => OrderItem::factory(),
            'product_id' => Product::factory(),
            'customer_name' => $this->faker->name(),
            'rating' => $this->faker->numberBetween(4, 5),
            'comment' => $this->faker->paragraph(),
            'is_approved' => true,
            'is_verified_buyer' => true,
        ];
    }
}
