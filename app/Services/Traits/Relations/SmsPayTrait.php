<?php

namespace App\Services\Traits\Relations;

use App\SmsPayment;
use App\Services\Conf\WebConf;
use App\CurPayment;

trait SmsPayTrait
{
    public function payments()
    {
        return $this->hasMany(SmsPayment::class);
    }
    public function cur_pay()
    {
        return $this->hasOne(CurPayment::class);
    }
    public function getHasSmsAttribute()
    {
        $this->loadMissing('cur_pay.payment');

        return !is_null($this->cur_pay);
    }

    public function scopeSmsUser($query, $username)
    {
        return $query->where(WebConf::getTableClm($username), $username);
    }
}
