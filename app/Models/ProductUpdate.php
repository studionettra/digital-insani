<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'version',
        'changelog',
        'email_message',
        'notify_users',
        'is_notified',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'notify_users' => 'boolean',
            'is_notified' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    protected $appends = ['html_changelog'];

    public function getHtmlChangelogAttribute()
    {
        return Str::markdown($this->changelog ?? '');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
