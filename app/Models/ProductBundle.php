<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductBundle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'discount_percentage',
        'is_active',
    ];

    protected $casts = [
        'discount_percentage' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'regular_price',
        'discounted_price',
        'savings_amount',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'bundle_product', 'bundle_id', 'product_id')->withTimestamps();
    }

    public function isAvailable(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if (! $this->relationLoaded('products')) {
            $this->load(['products.variations']);
        }

        if ($this->products->count() < 2) {
            return false;
        }

        return ! $this->products->contains(fn ($p) => ! $p->is_active);
    }

    public function getRegularPriceAttribute(): float
    {
        if (! $this->relationLoaded('products')) {
            return 0;
        }

        return (float) $this->products->sum(function ($product) {
            $firstVariation = $product->variations->first();

            return $firstVariation ? (float) $firstVariation->price : 0;
        });
    }

    public function getDiscountedPriceAttribute(): float
    {
        $regular = $this->regular_price;
        if ($regular <= 0) {
            return 0;
        }

        return round($regular * (1 - ($this->discount_percentage / 100)));
    }

    public function getSavingsAmountAttribute(): float
    {
        return max(0, $this->regular_price - $this->discounted_price);
    }
}
