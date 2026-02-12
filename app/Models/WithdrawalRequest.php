<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class WithdrawalRequest extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'status',
        'transaction_id',
        'rejection_reason',
        'note',
        'astimated_transfer_time',
        'screenshot_path',
        'invoice_path',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }


    public function mechanic()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    protected $appends = [
        'received_at',
    ];

    public function getReceivedAtAttribute()
    {
        return $this->created_at ? Carbon::parse($this->created_at)->format('d M Y h:i A') : null;
    }
}
