<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Ramsey\Uuid\Uuid;

class ServiceType extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'status'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
            $model->slug = Str::slug($model->name);
        });
    }
}
