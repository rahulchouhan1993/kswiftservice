<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $fillable = [
        'name',
        'iso_2',
        'iso_3',
        'phone_code',
        'currency',
        'flag',
        'status'
    ];


    public function states()
    {
        return $this->hasMany(State::class, 'country_id', 'id')->orderBy('name');
    }
}
