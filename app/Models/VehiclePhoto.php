<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class VehiclePhoto extends Model
{
    protected $fillable = [
        'user_id',
        'vehicle_id',
        'photo'
    ];

    protected $appends = ['photo_url'];
    protected $hidden  = ['photo', 'id', 'user_id', 'vehicle_id', 'created_at', 'updated_at'];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }

    public function getPhotoUrlAttribute()
    {
        if ($this->photo) {
            return asset('storage/vehicle_photos/' . $this->photo);
        }
        return null;
    }
}
