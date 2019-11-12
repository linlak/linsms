<?php

namespace App\Services\Traits\Relations;

use App\Like;

/**
 * 
 */
trait HasLikes
{
    public function likes()
    {
        return $this->morphMany(Like::class, 'likable');
    }
}
