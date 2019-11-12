<?php

namespace App;

use App\Services\Traits\Relations\UserTrait;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    //
    use UserTrait;

    public function likable()
    {
        return $this->morphTo('likable');
    }
}
