<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class BookingRequest extends Model
{

    protected $fillable = [
        'user_id',
        'booking_id',
        'mecanic_id',
        'mechanic_status',
        'note',
        'rejection_reason',
        'astimated_delivery_date',
        'last_updated_at',
        'admin_status',
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
        return $this->belongsTo(User::class, 'user_id');
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function myRequest()
    {
        return $this->hasOne(BookingAcceptRequest::class, 'booking_request_id', 'id');
    }

}
