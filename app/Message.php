<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Services\Traits\Relations\UserTrait;

class Message extends Model
{
    use UserTrait;
    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
