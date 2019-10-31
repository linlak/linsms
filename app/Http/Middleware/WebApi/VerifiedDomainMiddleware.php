<?php

namespace App\Http\Middleware\WebApi;

use App\Services\Traits\WebApi\GuardTrait;
use Closure;

class VerifiedDomainMiddleware
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
        return $next($request);
    }
}
