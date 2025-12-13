<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Ramsey\Uuid\Uuid;

class TicketDocument extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'ticket_id',
        'attechement'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }

    protected $appends = [
        'attachment_url',
    ];


    public function getAttachmentUrlAttribute()
    {
        $photo = $this->attechement ?? null;

        if ($photo) {
            return asset('storage/attachment_photos/' . $photo);
        }

        return null;
    }
}
