<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Ramsey\Uuid\Uuid;

class UserAddress extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id',
        'country_id',
        'state_id',
        'city_id',
        'address',
        'pincode',
        'is_default_address',
        'status'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }
}
