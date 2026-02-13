<?php

namespace App\Models;

use App\Helpers;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class WalletTransition extends Model
{
    protected $fillable = [
        'txn_id',
        'user_id',
        'amount',
        'txn_type',
        'current_balance',
        'invoice_path',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
            $model->txn_id = 'TXN'.strtoupper(Helpers::shortUuid());
        });
    }

    protected $appends = [
        'txn_date',
        'invoice_url',
    ];

    public function getTxnDateAttribute()
    {
        return $this->created_at ? Carbon::parse($this->created_at)->format('d M Y h:i A') : null;
    }

    public function getInvoiceUrlAttribute()
    {
        $invoice = $this->invoice_path ?? null;
        if ($invoice) {
            return asset('storage/invoices/' . $invoice);
        }
        return null;
    }
}
