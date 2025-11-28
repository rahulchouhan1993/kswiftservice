<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class GaragePhoto extends Model
{
    protected $fillable = [
        'garage_id',
        'photo',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }



    protected $appends = ['photo_url'];
    public function getPhotoUrlAttribute()
    {
        $photo = $this->photo ?? null;

        if ($photo) {
            return asset('storage/garage_photos/' . $photo);
        }

        return null;
    }



    public function garage()
    {
        return $this->belongsTo(Garage::class, 'id', 'garage_id');
    }
}
