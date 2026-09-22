<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entitlement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'product_variation_id',
        'order_id',
        'download_count',
        'granted_at',
        'revoked_at',
    ];

    protected $casts = [
        'granted_at' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    /**
     * Get the user that owns the entitlement.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product that the entitlement is for.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function productVariation()
    {
        return $this->belongsTo(ProductVariation::class);
    }

    /**
     * Get the order that granted this entitlement.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Scope a query to only include active entitlements.
     */
    public function scopeActive($query)
    {
        return $query->whereNull('revoked_at');
    }
}
