<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentWebhookEvent extends Model
{
    protected $fillable = [
        'provider',
        'event_type',
        'external_id',
        'payload',
        'status',
    ];

    protected $casts = [
        'payload' => 'array',
    ];
}
