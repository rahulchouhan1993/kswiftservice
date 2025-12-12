<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class WhatsappMsgHistory extends Model
{
    protected $fillable = [
        'user_id',
        'template_name',
        'phone',
        'status',
        'response'
    ];

    protected $casts = [
        'response' => 'array'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }
}
