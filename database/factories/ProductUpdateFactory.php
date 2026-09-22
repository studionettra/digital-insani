<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductUpdate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductUpdate>
 */
class ProductUpdateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'version' => $this->faker->numerify('#.#.#'),
            'changelog' => $this->faker->paragraph(),
            'email_message' => $this->faker->sentence(),
            'notify_users' => false,
            'is_notified' => false,
            'published_at' => now(),
        ];
    }
}
