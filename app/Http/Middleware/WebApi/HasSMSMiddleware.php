<?php

namespace App\Http\Middleware\WebApi;

use App\Services\Traits\WebApi\GuardTrait;
use Closure;

class HasSMSMiddleware
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
            if (!$this->guard()->user()->has_sms) {
                header('HTTP/1.1 403 No SMS');
                exit;
            }
        }
        return $next($request);
    }
}
