<?php

namespace App\WebApi;

use Illuminate\Database\Eloquent\Model;
use App\Services\Traits\Relations\WebApi\WebAppTrait;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;

class WebAppStat extends Model
{

    use WebAppTrait, Cachable;

    protected $fillable = ['message', 'app_id', 'status'];
}
