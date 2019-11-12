<?php

namespace App;

use App\Services\Traits\Relations\HasComments;
use App\Services\Traits\Relations\HasLikes;
use App\Services\Traits\Relations\UserTrait;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use UserTrait, HasComments, HasLikes;
    //
    protected $fillable = [
        'body',
        'user_id',
        'is_admin',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_admin' => 'boolean',
    ];
}
