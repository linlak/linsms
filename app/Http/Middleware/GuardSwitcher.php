<?php

namespace App\Http\Middleware;

use Closure;

class GuardSwitcher
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $defaultGuard = null)
    {
        if (\in_array($defaultGuard, array_keys(\config('auth.guards')))) {
            if (\auth()->getDefaultDriver() != $defaultGuard) {
                \auth()->setDefaultDriver($defaultGuard);
            }
        }
        return $next($request);
    }
}
