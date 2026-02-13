<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;
use Illuminate\Database\Eloquent\Casts\Attribute;


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

    public function mechanic()
    {
        return $this->belongsTo(User::class, 'mecanic_id', 'id');
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    protected $appends = [
        'delivery_date',
    ];

    public function DeliveryDate(): Attribute
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
