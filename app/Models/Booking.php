<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'mechanic_id',
        'booking_id',
        'vehicle_id',
        'date',
        'time',
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
        ];
    }


    public function services()
    {
        return $this->hasMany(BookingService::class, 'booking_id', 'id');
    }

    public function customer()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function mechanic()
    {
        return $this->hasOne(User::class, 'id', 'mechanic_id');
    }

    public function vehicle()
    {
        return $this->hasOne(Vehicle::class, 'id', 'vehicle_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'booking_id', 'id');
    }

    public function pickup_address()
    {
        return $this->belongsTo(UserAddress::class, 'pickup_id', 'id');
    }

    public function drop_address()
    {
        return $this->belongsTo(UserAddress::class, 'drop_id', 'id');
    }
}
