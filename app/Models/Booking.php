<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;
use Illuminate\Database\Eloquent\Casts\Attribute;


class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'mechanic_id',
        'garage_id',
        'booking_id',
        'vehicle_id',
        'date',
        'time',
        'assigned_date',
        'delivery_date',
        'pickup_type',
        'pickup_id',
        'drop_id',
        'additional_note',
        'extra_services',
        'user_address_id',
        'status',
        'booking_status'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
            $model->booking_id = 'TXN-' . rand(000000000, 999999999);
        });
    }

    protected function casts(): array
    {
        return [
            'extra_services' => 'array',
            'assigned_date' => 'datetime',
            'delivery_date' => 'datetime',
        ];
    }


    public function mechanic_earning()
    {
        return $this->hasOne(MechanicEarning::class, 'booking_id', 'id');
    }

    public function services()
    {
        return $this->hasMany(BookingService::class, 'booking_id', 'id');
    }

    public function customer()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function review()
    {
        return $this->hasOne(BookingReview::class, 'booking_id', 'id');
    }

    public function mechanic()
    {
        return $this->hasOne(User::class, 'id', 'mechanic_id');
    }

    public function garage()
    {
        return $this->hasOne(Garage::class, 'id', 'garage_id');
    }

    public function vehicle()
    {
        return $this->hasOne(Vehicle::class, 'id', 'vehicle_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'booking_id', 'id')->where('status', 'success')->latest();
    }

    public function pickup_address()
    {
        return $this->belongsTo(UserAddress::class, 'pickup_id', 'id');
    }

    public function drop_address()
    {
        return $this->belongsTo(UserAddress::class, 'drop_id', 'id');
    }

    public function mechanic_job()
    {
        return $this->hasOne(MechanicJob::class, 'booking_id', 'id')->latest();
    }

    protected $appends = [
        'booking_date',
        'assigned_at',
        'delivered_at',
    ];

    public function bookingDate(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->date || !$this->time) {
                    return '--/--/---- --:--';
                }

                // return Carbon::parse(
                //     $this->date . ' ' . $this->time
                // )->format('d-M-Y h:i A');

                return Carbon::parse(
                    $this->date . ' ' . $this->time
                )->format('d-M-Y');
            }
        );
    }


    public function assignedAt(): Attribute
    {
        return Attribute::make(
            get: fn() =>
            $this->assigned_date
                ? $this->assigned_date->format('d-M-Y')
                : null
        );
    }

    public function deliveredAt(): Attribute
    {
        return Attribute::make(
            get: fn() =>
            $this->delivery_date
                ? $this->delivery_date->format('d-M-Y h:i A')
                : null
        );
    }
}
