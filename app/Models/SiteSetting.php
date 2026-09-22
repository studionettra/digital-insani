<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
    ];

    /**
     * Get a setting value by key.
     * Caches the result forever until it is updated.
     */
    public static function get(string $key, $default = null)
    {
        return Cache::rememberForever("site_setting.{$key}", function () use ($key, $default) {
            $setting = self::where('key', $key)->first();

            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Set a setting value by key.
     */
    public static function set(string $key, $value, $group = 'general', $type = 'text')
    {
        $setting = self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'group' => $group,
                'type' => $type,
            ]
        );

        Cache::forget("site_setting.{$key}");

        return $setting;
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::saved(function ($setting) {
            Cache::forget("site_setting.{$setting->key}");
        });

        static::deleted(function ($setting) {
            Cache::forget("site_setting.{$setting->key}");
        });
    }
}
