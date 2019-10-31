<?php

namespace App\Services\Traits\Relations;

use App\EasyPay;

trait HasEasy
{
    public function easy_pay()
    {
        return $this->morphOne(EasyPay::class, 'easable');
    }
}
