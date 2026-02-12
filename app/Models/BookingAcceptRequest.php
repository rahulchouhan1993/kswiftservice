<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;
use Illuminate\Database\Eloquent\Casts\Attribute;


class BookingAcceptRequest extends Model
{
    protected $fillable = [
        'booking_request_id',
        'booking_id',
        'user_id',
        'note',
        'astimated_delivery_date',
        'accepted_at',
        'status',
        'admin_status',
        'rejection_reason'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }


    public function bookingRequest()
    {
        return $this->belongsTo(BookingRequest::class, 'booking_request_id');
    }

    public function mechanic()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    protected $appends = [
        'delivery_date',
    ];

    public function deliveryDate(): Attribute
    {
        return Attribute::make(
            get: function () {
                return Carbon::parse(
                    $this->astimated_delivery_date
                )->format('d-M-Y h:i A');
            }
        );
    }
}
