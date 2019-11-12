<?php

namespace App;

use App\Services\Traits\Relations\HasLikes;
use App\Services\Traits\Relations\UserTrait;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    //
    use UserTrait, HasLikes;

    public function commentable()
    {
        return $this->morphTo();
    }
    public function replies()
    {
        $this->hasMany(Reply::class, 'comment_id', 'id');
    }
}
