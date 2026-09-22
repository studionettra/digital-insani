<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'access_token',
        'customer_name',
        'customer_email',
        'customer_phone',
        'order_number',
        'subtotal',
        'discount_amount',
        'coupon_code',
        'total_amount',
        'status',
        'external_id',
        'payment_id',
        'payment_url',
        'snap_token',
        'payment_method',
        'paid_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'paid_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function webhookEvents()
    {
        return $this->hasMany(PaymentWebhookEvent::class, 'external_id', 'external_id');
    }
}
