<?php

namespace App\WebApi;

use App\Services\Traits\Relations\SmsAttrsTrait;
use App\Services\Traits\Relations\SmsFromPayTrait;
use App\Services\Traits\Relations\UserTrait;
use App\Services\Traits\Relations\WebApi\WebAppTrait;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Model;

class WebAppSms extends Model
{
    use SmsFromPayTrait, WebAppTrait, SmsAttrsTrait, Cachable, UserTrait;

    protected  $casts = [
        'sent_at' => 'datetime',
        'is_sent' => 'boolean',
        'is_failed' => 'boolean',
    ];
    protected $fillable = [
        'user_id',
        'app_id',
        'message',
        'recipients',
        'sender_id',
        'sms_before',
        'sms_after',
        'is_sent',
        'is_failed'
    ];
}
