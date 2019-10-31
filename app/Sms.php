<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Services\Traits\EncryptableTrait;
use App\Services\Traits\Relations\UserTrait;
use App\Services\Traits\Relations\SmsFromPayTrait;
use App\Services\Traits\Relations\SmsAttrsTrait;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;

class Sms extends Model
{
    use EncryptableTrait, UserTrait, SmsFromPayTrait, SmsAttrsTrait, Cachable;
    protected  $casts = [
        'sent_at' => 'datetime',
        'failed_at' => 'datetime',
        'is_sent' => 'boolean',
        'is_failed' => 'boolean',
    ];
    protected $fillable = [
        'user_id',
        'pay_id',
        'message',
        'recipients',
        'sender_id',
        'sms_before',
        'sms_after',
        'is_sent',
        'is_failed'
    ];
}
