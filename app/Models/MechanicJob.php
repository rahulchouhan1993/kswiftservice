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
        'rejection_reason'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }

    protected $appends = [
        'received_at'
    ];


    public function mechanic()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function booking()
    {
        return $this->hasOne(Booking::class, 'id', 'booking_id');
    }

    public function getReceivedAtAttribute()
    {
        return Carbon::parse($this->created_at)->format('d M Y');
    }
}
