<?php

namespace App\Services\Traits\Relations;

use App\User;

trait UserTrait
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
