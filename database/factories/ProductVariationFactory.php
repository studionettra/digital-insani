<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariation>
 */
class ProductVariationFactory extends Factory
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
            'name' => $this->faker->word().' Edition',
            'price' => $this->faker->randomFloat(0, 50000, 500000),
            'file_path' => null,
            'is_active' => true,
        ];
    }
}
