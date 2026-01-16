<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Garage extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'owner_name',
        'phone',
        'email',
        'country_id',
        'state_id',
        'city_id',
        'address',
        'pincode',
        'logo',
        'bay_count',
        'timings',
        'status'
    ];


    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }

    protected $appends = [
        'logo_url',
        'garage_reviews',
        'garage_rating'
    ];

    protected $casts = [
        'timings' => 'array',
    ];


    public function getLogoUrlAttribute()
    {
        $logo = $this->logo ?? null;

        if ($logo) {
            return asset('storage/garage_photos/' . $logo);
        }

        return null;
    }


    public function mechanic()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function garage_photos()
    {
        return $this->hasMany(GaragePhoto::class, 'garage_id', 'id');
    }

    public function country()
    {
        return $this->hasOne(Country::class, 'id', 'country_id');
    }

    public function state()
    {
        return $this->hasOne(State::class, 'id', 'state_id');
    }

    public function city()
    {
        return $this->hasOne(City::class, 'id', 'city_id');
    }

    public function reviews()
    {
        return $this->hasMany(BookingReview::class, 'garage_id', 'id');
    }

    public function getGarageRatingAttribute()
    {
        return $this->hasMany(BookingReview::class, 'garage_id', 'id')
            ->avg('review');
    }


    public function getGarageReviewsAttribute()
    {
        return round(
            $this->hasMany(BookingReview::class, 'garage_id', 'id')->avg('review') ?? 0,
            1
        );
    }
}
