<?php

namespace App\Services\Traits\Relations\WebApi;

use App\WebApi\WebApp;

trait HasWebApps
{
    public function web_apps()
    {
        return $this->hasMany(WebApp::class);
    }
}
