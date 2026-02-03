<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class UserChat extends Model
{
    protected $fillable = [
        'ticket_id',
        'from',
        'to',
        'booking_id',
        'message',
        'sender_role',
        'receiver_role',
        'attechment',
        'read_time'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to');
    }

    protected $appends = [
        'attechment_url'
    ];

    public function getAttechmentUrlAttribute()
    {
        $photo = $this->attechment ?? null;

        if ($photo) {
            return asset('storage/chat_attechments/' . $photo);
        }
        return null;
    }
}
