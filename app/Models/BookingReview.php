<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class BookingReview extends Model
{
    protected $fillable = [
        'user_id',
        'mechanic_id',
        'garage_id',
        'review',
        'feedback',
        'status'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }

    public function customer()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function mechanic()
    {
        return $this->hasOne(User::class, 'id', 'mechanic_id');
    }

    public function garage()
    {
        return $this->hasOne(Garage::class, 'id', 'garage_id');
    }
}
