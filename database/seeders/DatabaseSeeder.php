<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default Site Settings
        SiteSetting::set('site_name', 'Digital Insani');
        SiteSetting::set('support_email', 'support@digitalinsani.com');
        SiteSetting::set('contact_phone', '081234567890');

        // Admin User
        User::factory()->create([
            'name' => 'Admin Insani',
            'email' => 'admin@digitalinsani.com',
            'role' => 'admin',
            'password' => bcrypt('password'), // password default
        ]);

        // Member User
        User::factory()->create([
            'name' => 'Member Test',
            'email' => 'member@digitalinsani.com',
            'role' => 'member',
            'password' => bcrypt('password'),
        ]);

        // Seed some categories and products for UI testing
        $category1 = Category::factory()->create(['name' => 'Template UI', 'slug' => 'template-ui']);
        $category2 = Category::factory()->create(['name' => 'Plugins', 'slug' => 'plugins']);

        Product::factory(3)
            ->has(ProductVariation::factory()->count(2), 'variations')
            ->create(['category_id' => $category1->id]);

        Product::factory(3)
            ->has(ProductVariation::factory()->count(2), 'variations')
            ->create(['category_id' => $category2->id]);
    }
}
