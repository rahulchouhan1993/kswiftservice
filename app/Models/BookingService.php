<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class BookingService extends Model
{
    protected $fillable = [
        'user_id',
        'booking_id',
        'service_type_id',
        'service_amount',
        'service_discount',
        'video_path',
        'photo_path'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }

    public function service_type()
    {
        return $this->belongsTo(ServiceType::class, 'service_type_id', 'id');
    }
}
