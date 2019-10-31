<?php

namespace App\Services\Traits\Relations;

use App\SmsPayment;

trait SmsFromPayTrait
{
    public function payment()
    {
        return $this->belongsTo(SmsPayment::class, 'pay_id', 'id');
    }
}
