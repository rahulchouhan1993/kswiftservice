<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'booking_amount',
        'booking_discount',
        'date',
        'time',
        'pickup_type',
        'user_address_id',
        'status',
        'booking_status'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }
}
