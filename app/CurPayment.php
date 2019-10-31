<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Services\Traits\Relations\UserTrait;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;

class CurPayment extends Model
{
    use UserTrait, Cachable;
    protected $casts = ['is_active' => 'boolean'];

    public function payment()
    {
        return $this->belongsTo(SmsPayment::class, 'pay_id');
    }
}
