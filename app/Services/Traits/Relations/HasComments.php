<?php

namespace App\Services\Traits\Relations;

use App\Comment;

trait HasComments
{
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
