<?php

namespace App\Services\Traits\Relations;

trait SmsAttrsTrait
{

    protected $encryptable = ['sender_id', 'message', 'recipients'];
}
