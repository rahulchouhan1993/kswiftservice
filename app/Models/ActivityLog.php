<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'message',
        'page_link'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($v) {
            $v->uuid = Uuid::uuid4();
        });
    }

    protected $appends = [
        'received_at'
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function getReceivedAtAttribute()
    {
        return Carbon::parse($this->created_at)->format('d M Y');
    }
}
