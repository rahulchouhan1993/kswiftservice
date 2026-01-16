<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class MechanicJob extends Model
{
    protected $fillable = [
        'user_id',
        'booking_id',
        'status',
        'cancellation_reason',
        'rejection_reason',
        'rejection_time'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }

    protected $appends = [
        'received_at',
        'rejected_at'
    ];


    public function mechanic()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function booking()
    {
        return $this->hasOne(Booking::class, 'id', 'booking_id');
    }

    public function getRejectedAtAttribute()
    {
        return $this->rejection_time ? Carbon::parse($this->rejection_time)->format('d M Y') : null;
    }

    public function getReceivedAtAttribute()
    {
        return $this->created_at ? Carbon::parse($this->created_at)->format('d M Y') : null;
    }
}