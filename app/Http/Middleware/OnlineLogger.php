<?php

namespace App\Http\Middleware;

use App\Services\Traits\OnlineStatTrait;
use Closure;
use Illuminate\Support\Str;

class OnlineLogger
{
    use OnlineStatTrait;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!Str::startsWith($request->server()['REQUEST_SCHEME'], 'http')) {
            return $next($request);
        }
        $this->logOnline($request);
        return $next($request);
    }
}
