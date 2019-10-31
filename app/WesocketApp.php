<?php

namespace App;

use App\Services\Traits\Relations\UserTrait;
use Illuminate\Database\Eloquent\Model;

class WesocketApp extends Model
{
    //
    use UserTrait;
    protected $fillable = [
        'enable_statistics',
        'enable_statistics',
        'is_editable',

        'user_id',
        'app_name',
        'app_key',
        'app_secret',
        'app_host',
        'capacity',
    ];
    protected $casts = [
        'enable_client_messages' => 'boolean',
        'enable_statistics' => 'boolean',
        'is_editable' => 'boolean',
    ];
}
