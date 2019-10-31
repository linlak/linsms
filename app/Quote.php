<?php

namespace App;

use App\Services\Traits\Relations\UserTrait;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use UserTrait;
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
