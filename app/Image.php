<?php

namespace App;

use App\Services\Traits\Relations\HasComments;
use App\Services\Traits\Relations\HasLikes;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasComments, HasLikes;
    public function imageable()
    {
        return $this->morphTo();
    }
}
