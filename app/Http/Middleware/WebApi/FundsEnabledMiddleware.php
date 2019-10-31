<?php

namespace App\Http\Middleware\WebApi;

use App\Services\Traits\WebApi\GuardTrait;
use Closure;

class FundsEnabledMiddleware
{
    use GuardTrait;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($this->guard()->check()) {
            if (!$this->guard()->web_app()->web_conf->funds_enabled) {
                header('HTTP/1.1 403 Funds Api not enabled for this app');
                exit;
            }
        }
        return $next($request);
    }
}
