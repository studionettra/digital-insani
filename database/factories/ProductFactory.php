<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'title' => $this->faker->sentence(),
            'slug' => $this->faker->unique()->slug(),
            'description' => $this->faker->paragraph(),
            'cover_image' => null,
            'is_active' => true,
        ];
    }
}
