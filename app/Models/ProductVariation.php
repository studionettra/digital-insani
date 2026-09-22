<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariation extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'name',
        'price',
        'delivery_type',
        'file_path',
        'file_url',
        'is_active',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
