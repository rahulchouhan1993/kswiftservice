<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class MechanicJob extends Model
{
    protected $fillable = [
        'user_id',
        'booking_id',
        'status',
        'rejection_reason'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }


    public function booking()
    {
        return $this->hasOne(Booking::class, 'id', 'booking_id');
    }
}
