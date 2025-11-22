<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Garage extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'country_id',
        'state_id',
        'city_id',
        'address',
        'pincode',
        'status',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }

    protected $appends = [
        'photo_url',
    ];


    public function getPhotoUrlAttribute()
    {
        $photo = $this->photo ?? null;

        if ($photo) {
            return asset('storage/garage_photos/' . $photo);
        }

        return null;
    }
}