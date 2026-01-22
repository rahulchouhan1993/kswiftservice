<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class WhatsappMsgHistory extends Model
{
    protected $fillable = [
        'msg_id',
        'user_phone',
        'user_name',
        'msg_type',
        'status',
        'is_read',
        'sent_time',
        'related_msg_id',
        'message',
        'platform'
    ];

    protected $casts = [
        'response' => 'array'
    ];
}
