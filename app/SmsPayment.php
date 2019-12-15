<?php

namespace App;

use App\Services\Traits\Relations\HasAdmin;
use Illuminate\Database\Eloquent\Model;
use App\Services\Traits\Relations\UserTrait;
use App\Services\Traits\Relations\HasEasy;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;

class SmsPayment extends Model
{
    //
    use UserTrait, HasEasy, Cachable, HasAdmin;
    protected $fillable = ['user_id', 'sms_count', 'sms_price', 'p_ref'];
    protected $append = ['remaining', 'total', 'is_current'];

    protected $casts = ['is_m2u' => 'boolean', 'last_used' => 'datetime', 'verified_at' => 'datetime', 'carried_at' => 'datetime', 'is_current' => 'boolean'];



    public function getRemainingAttribute()
    {
        return (($this->total) - ($this->sms_carried + $this->sms_shared + $this->sms_used));
    }
    public function getTotalAttribute()
    {
        return ($this->sms_count + $this->me2u_count + $this->sms_brought);
    }
    public function carried()
    {
        return $this->hasOne(SmsPayment::class, 'c_to', 'id');
    }

    public function brought()
    {
        return $this->belongsTo(SmsPayment::class, 'b_frm', 'id');
    }
    public function received()
    {
        return $this->belongsTo(Me2U::class, 'm2u_id');
    }
    public function sms()
    {
        return $this->hasMany(Sms::class, 'pay_id', 'id');
    }
    public function getIsCurrentAttribute()
    {
        $this->loadMissing("cur_pay");
        return !is_null($this->cur_pay);
    }
    public function cur_pay()
    {
        return $this->hasOne(CurPayment::class, 'pay_id');
    }
}
