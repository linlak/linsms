<?php

namespace App;

use App\Services\Traits\Relations\HasComments;
use App\Services\Traits\Relations\HasLikes;
use App\Services\Traits\Relations\UserTrait;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    //
    use UserTrait, HasComments, HasLikes;
}
