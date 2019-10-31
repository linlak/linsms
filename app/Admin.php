<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Services\Traits\Relations\UserTrait;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;

class Admin extends Model
{
    use UserTrait, Cachable;
    protected $fillable = [
        'user_id', 'post', 'last_seen',
    ];
    protected $casts = [
        'last_seen' => 'datetime',
        'is_active' => 'boolean'
    ];
}
