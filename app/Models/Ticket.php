<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Ticket extends Model
{
    protected $fillable = [
        'booking_id',
        'user_id',
        'user_role',
        'ticketId',
        'subject',
        'description',
        'attachment',
        'status',
        'ticket_status'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
            $model->ticketId = 'TC-' . rand(000000000, 999999999);
        });
    }

    protected $appends = [
        'attachment_url'
    ];


    public function getAttachmentUrlAttribute()
    {
        $photo = $this->attachment ?? null;

        if ($photo) {
            return asset('storage/attachment_photos/' . $photo);
        }

        return null;
    }

    public function documents()
    {
        return $this->hasMany(TicketDocument::class, 'ticket_id', 'id');
    }

    public function chats()
    {
        return $this->hasMany(UserChat::class, 'ticket_id', 'id');
    }

    public function booking()
    {
        return $this->hasOne(Booking::class, 'booking_id', 'id');
    }
}
