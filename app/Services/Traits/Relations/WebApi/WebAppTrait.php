<?php

namespace App\Services\Traits\Relations\WebApi;

use App\WebApi\WebApp;

trait WebAppTrait
{
    public function web_app()
    {
        return $this->belongsTo(WebApp::class, 'app_id', 'id');
    }
}
