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


    public function garage_photos()
    {
        return $this->hasMany(GaragePhoto::class, 'garage_id', 'id');
    }
}
