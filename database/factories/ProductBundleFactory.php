<?php

namespace Database\Factories;

use App\Models\ProductBundle;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ProductBundle>
 */
class ProductBundleFactory extends Factory
{
    protected $model = ProductBundle::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = 'Paket Bundle '.$this->faker->words(3, true);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.uniqid(),
            'description' => $this->faker->sentence(),
            'discount_percentage' => 20,
            'is_active' => true,
        ];
    }
}
