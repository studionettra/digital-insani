<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'product_variation_id' => ProductVariation::factory(),
            'price' => 50000,
            'download_count' => 0,
        ];
    }
}
