<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Ramsey\Uuid\Uuid;
use Illuminate\Database\Eloquent\Casts\Attribute;


class AppFeedback extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id',
        'booking_id',
        'given_by',
        'rating',
        'feedback'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->uuid = Uuid::uuid4();
        });
    }

    protected $appends = [
        'feedback_date',
    ];

    public function feedbackDate(): Attribute
    {
        return Attribute::make(
            get: fn() =>
            $this->created_at
                ? $this->created_at->format('d-M-Y')
                : null
        );
    }
}
