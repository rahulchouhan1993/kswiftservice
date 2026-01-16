<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class BookingLog extends Model
{
    protected $fillable = [
        'booking_id',
        'user_id',
        'mechanic_id',
        'mechanic_job_id',
        'status',
        'log_msg',
        'cancellation_reason',
        'rejection_reason',
        'booking_date',
        'cancel_date',
        'delivery_date',
        'reject_date'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }

    protected function casts(): array
    {
        return [
            'booking_date' => 'datetime',
            'cancel_date' => 'datetime',
            'delivery_date' => 'datetime',
            'reject_date' => 'datetime',
        ];
    }
}
