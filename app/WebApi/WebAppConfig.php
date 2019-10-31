<?php

namespace App\WebApi;

use Illuminate\Database\Eloquent\Model;
use App\Services\Traits\Relations\WebApi\WebAppTrait;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;

class WebAppConfig extends Model
{
    use WebAppTrait, Cachable;

    protected $fillable = ['app_id'];

    protected $touches = ['web_app'];

    protected $casts = [
        'funds_enabled' => 'boolean',
        'sms_enabled' => 'boolean',
        'payout_enabled' => 'boolean'
    ];
}
