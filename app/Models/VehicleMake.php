<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Ramsey\Uuid\Uuid;

class VehicleMake extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'logo_path',
        'status'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
            $model->slug = Str::slug($model->name);
        });
    }


    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'vehicle_make_id', 'id');
    }
}
