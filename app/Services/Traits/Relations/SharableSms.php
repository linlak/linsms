<?php

namespace App\Services\Traits\Relations;

use App\Me2U;

trait SharableSms
{
    public function shared_sms()
    {
        return $this->hasMany(Me2U::class);
    }
    public function recieved_sms()
    {
        return $this->hasMany(Me2U::class, 'recipient_id');
    }
}
