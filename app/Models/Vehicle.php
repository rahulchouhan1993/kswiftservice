<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Ramsey\Uuid\Uuid;

class Vehicle extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id',
        'vehicle_make_id',
        'vehicle_type',
        'vehicle_number',
        'model',
        'vehicle_year',
        'fuel_type',
        'transmission',
        'mileage',
        'user_address_id',
        'status',
        'additional_note'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }

    public function vehicle_photos()
    {
        return $this->hasMany(VehiclePhoto::class, 'vehicle_id', 'id');
    }
}
