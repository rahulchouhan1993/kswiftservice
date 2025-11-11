<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class BookingService extends Model
{
    protected $fillable = [
        'user_id',
        'booking_id',
        'service_type_id',
        'service_amount',
        'service_discount'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }
}
