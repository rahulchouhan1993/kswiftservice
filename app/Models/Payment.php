<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'booking_id',
        'txnId',
        'amount',
        'payment_mode',
        'status',
        'invoice_path'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    protected $appends = [
        'invoice_url',
        'received_at'
    ];


    public function getInvoiceUrlAttribute()
    {
        $invoice = $this->invoice_path ?? null;

        if ($invoice) {
            return asset('storage/invoices/' . $invoice);
        }

        return null;
    }

    public function getReceivedAtAttribute()
    {
        return Carbon::parse($this->created_at)->format('d M Y');
    }
}
