<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Download extends Model
{
    protected $fillable = [
        'entitlement_id',
        'order_item_id',
        'user_id',
        'ip_address',
        'user_agent',
        'downloaded_at',
    ];

    protected function casts(): array
    {
        return [
            'downloaded_at' => 'datetime',
        ];
    }

    public function entitlement()
    {
        return $this->belongsTo(Entitlement::class);
    }

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
