<?php

namespace App\Models;

use App\Helpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;
use Milon\Barcode\Facades\DNS2DFacade as DNS2D;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;
    protected $guard_name = 'web';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'profile_pic',
        'name',
        'last_name',
        'dob',
        'phone',
        'role',
        'otp',
        'otp_expire',
        'phone_verified_at',
        'whatsapp_number',
        'email',
        'email_verified_at',
        'country_id',
        'state_id',
        'city_id',
        'address',
        'pincode',
        'aadharcard_no',
        'kyc_status',
        'kyc_response',
        'status',
        'password',
        'is_profile_updated',
        'is_signup_complete',
        'balence'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($v) {
            $v->uuid = Uuid::uuid4();
        });
    }

    protected $hidden = [
        'password',
        'remember_token',
        'kyc_response',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected $appends = [
        'profile_photo_url',
        'mechanic_reviews',
        'member_since',
        'trashed_at',
        'fcm_token'
    ];


    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function memberSince(): Attribute
    {
        return Attribute::make(
            get: fn() => empty($this->created_at) ? '--/--/----' : $this->created_at->format('d-m-Y')
        );
    }


    public function trashedAt(): Attribute
    {
        return Attribute::make(
            get: fn() => empty($this->deleted_at) ? '--/--/----' : $this->deleted_at->format('d-m-Y h:i A')
        );
    }

    public function default_address()
    {
        return $this->hasOne(UserAddress::class, 'user_id', 'id')
            ->where('is_default_address', 1)->latest();
    }

    public function fcmToken()
    {
        return $this->hasOne(FcmToken::class, 'user_id', 'id')->select('token');
    }

    public function getFcmTokenAttribute()
    {
        return $this->fcmToken()->first();
    }

    public function getProfilePhotoUrlAttribute()
    {
        $photo = $this->profile_pic ?? null;

        if ($photo) {
            return asset('storage/users_photos/' . $photo);
        }

        $name = trim($this->name ?? '');
        if ($name === '') {
            if ($this->role == 'customer') {
                $avatarText = 'C' . $this->id;
            } else {
                $avatarText = 'M' . $this->id;
            }
        } else {
            $avatarText = trim(
                collect(explode(' ', $name))->map(function ($segment) {
                    return mb_substr($segment, 0, 1);
                })->join('')
            );
        }

        return 'https://ui-avatars.com/api/?name=' . urlencode($avatarText)
            . '&color=B8EA3F&background=000000&size=128';
    }



    public function addresses()
    {
        return $this->hasMany(UserAddress::class, 'user_id', 'id');
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'user_id', 'id');
    }

    public function garage()
    {
        return $this->hasMany(Garage::class, 'user_id', 'id');
    }

    public function latest_garage()
    {
        return $this->hasMany(Garage::class, 'user_id', 'id')->latest();
    }

    public function user_booking()
    {
        return $this->hasMany(Booking::class, 'user_id', 'id');
    }

    public function mechanic_booking()
    {
        return $this->hasMany(Booking::class, 'mechanic_id', 'id');
    }

    public function wallet_transitions()
    {
        return $this->hasMany(WalletTransition::class, 'user_id', 'id');
    }


    public function getMechanicReviewsAttribute()
    {
        if ($this->role !== 'mechanic') {
            return null;
        }

        return round(
            $this->hasMany(BookingReview::class, 'mechanic_id', 'id')->avg('review') ?? 0,
            1
        );
    }

    public function mechanic_earnings()
    {
        return $this->hasMany(MechanicEarning::class, 'mechanic_id', 'id');
    }
}
