<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Services\Traits\EncryptableTrait;
use App\Services\Traits\Relations\UserTrait;

class QueuedSms extends Model
{
    use EncryptableTrait, UserTrait;

    protected $casts = [
        'schedule_time' => 'datetime',
        'is_queued' => 'boolean',
        'failed' => 'boolean'
    ];
    protected $encryptable = ['sender_id', 'message', 'recipients'];
    protected $fillable = [
        'sender_id',
        'recipients',
        'message',
        'schedule_time',
        'user_id',
        'failed',
        'is_queued',
        'tries'
    ];
}
