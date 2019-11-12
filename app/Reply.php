<?php

namespace App;

use App\Services\Traits\Relations\HasLikes;
use App\Services\Traits\Relations\UserTrait;
use Illuminate\Database\Eloquent\Model;

class Reply extends Model
{
    //
    use UserTrait, HasLikes;
    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }
}
