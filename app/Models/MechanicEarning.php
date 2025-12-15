<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class MechanicEarning extends Model
{
    protected $fillable = [
        'user_id',
        'mechanic_id',
        'booking_id',
        'amount'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }


    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function booking()
    {
        return $this->hasOne(Booking::class, 'id', 'booking_id');
    }
}