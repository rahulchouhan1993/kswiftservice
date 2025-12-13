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
        'photo_path',
        'note'
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

    public function booking()
    {
        return $this->hasOne(Booking::class, 'id', 'booking_id');
    }


    protected $appends = [
        'photo_url',
        'video_url',
    ];

    public function getPhotoUrlAttribute()
    {
        $photo = $this->photo_path ?? null;
        if ($photo) {
            return asset('storage/service_photos/' . $photo);
        }

        return null;
    }

    public function getVideoUrlAttribute()
    {
        $video = $this->video_path ?? null;
        if ($video) {
            return asset('storage/service_videos/' . $video);
        }

        return null;
    }
}
