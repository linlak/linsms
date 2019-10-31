<?php

namespace App;

use App\Services\Traits\Relations\UserTrait;
use Illuminate\Database\Eloquent\Model;

class OnlineClient extends Model
{
    use UserTrait;
    //
    protected $primaryKey = 'client_ip';
    protected $keyType = 'string';
    protected $fillable = ['client_ip', 'last_seen', 'user_id'];
    protected $casts = ['last_seen' => 'datetime',];

    public $incrementing = false;
}
