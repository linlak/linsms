<?php

namespace App\Http\Middleware\WebApi;

use App\Services\Traits\WebApi\GuardTrait;
use Closure;

class AppMiddleware
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
        if (!$this->guard()->check()) {
            \header('HTTP/1.1 401 Authorization Required');
            \header('WWW-Authicate: Basic realm="Access denied"');
            exit;
        }
        return $next($request);
    }
}
