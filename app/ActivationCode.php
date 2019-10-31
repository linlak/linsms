<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Services\Traits\Relations\UserTrait;

class ActivationCode extends Model
{
    //
    use UserTrait;

    protected $fillable = [
        'user_id',
        'v_code',
        'expires_at',
        'code_type',
        'notification_type'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
