<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;

class Me2U extends Model
{
    use Cachable;

    protected $fillable = [
        'user_id', 'recipient_id', 'sms_count', 'redeemed_at', 'to_ref', 'from_ref'
    ];
    protected $casts = [
        'redeemed_at' => 'datetime',
        'reemed' => 'boolean'
    ];
    protected $append = ['redeemed'];

    public function sender()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    public function me2_pay()
    {
        return $this->hasOne(SmsPayment::class, 'm2u_id');
    }
    public function me2u_pay()
    {
        return $this->belongsTo(SmsPayment::class, 'from_ref', 'id');
    }
    public function scopeMeU($query, $voucher_code)
    {
        return $query->where('sms_voucher', $voucher_code)->whereNull('redeemed_at');
    }
    public function getRedeemedAttribute()
    {
        return !is_null($this->redeemed_at);
    }
}
