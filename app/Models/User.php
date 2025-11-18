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
        'profile_pic',
        'name',
        'last_name',
        'dob',
        'phone',
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
        'is_profile_updated'
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
        'received_at',
        'trashed_at',
    ];


    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function receivedAt(): Attribute
    {
        return Attribute::make(
            get: fn() => empty($this->created_at) ? '--/--/----' : $this->created_at->format('d-m-Y h:i A')
        );
    }

    public function trashedAt(): Attribute
    {
        return Attribute::make(
            get: fn() => empty($this->deleted_at) ? '--/--/----' : $this->deleted_at->format('d-m-Y h:i A')
        );
    }


    public function getProfilePhotoUrlAttribute()
    {
        $photo = $this->profile_pic ?? null;

        if ($photo) {
            return asset('storage/users_photos/' . $photo);
        }
        $name = trim(collect(explode(' ', $this->name))->map(function ($segment) {
            return mb_substr($segment, 0, 1);
        })->join(' '));

        return 'https://ui-avatars.com/api/?name=' . urlencode($name) . '&color=B8EA3F&background=000000&size=128';
    }


    public function addresses()
    {
        return $this->hasMany(UserAddress::class, 'user_id', 'id');
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'user_id', 'id');
    }
}