<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    protected $fillable = [
        'country_id',
        'name',
        'status'
    ];

    public function cities()
    {
        return $this->hasMany(City::class, 'state_id', 'id')->orderBy('name');
    }
}
