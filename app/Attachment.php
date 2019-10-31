<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Services\Traits\Relations\UserTrait;

class Attachment extends Model
{
    //
    use UserTrait;
}
