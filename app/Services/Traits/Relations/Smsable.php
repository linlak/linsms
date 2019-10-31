<?php

namespace App\Services\Traits\Relations;

use App\Sms;
use App\QueuedSms;

trait Smsable
{
    public function sms()
    {
        return $this->hasMany(Sms::class);
    }
    public function pending_sms()
    {
        return $this->hasMany(QueuedSms::class);
    }
}
