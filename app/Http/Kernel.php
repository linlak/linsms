<?php

namespace App\Http;

use App\Http\Middleware\AdminMiddleware;
use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array
     */
    protected $middleware = [
        \App\Http\Middleware\CheckForMaintenanceMode::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        \App\Http\Middleware\TrustProxies::class,
        \App\Http\Middleware\RefreshAuth::class,
        \Nutsweb\LaravelPrerender\PrerenderMiddleware::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            // \Illuminate\Session\Middleware\AuthenticateSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,

            \App\Http\Middleware\OnlineLogger::class,
        ],

        'api' => [
            'throttle:60,1',
            'bindings',
            'guardswitcher:api',
            \App\Http\Middleware\OnlineLogger::class,
        ],
        'webapi' => [
            'throttle:60,1',
            'bindings',
            \App\Http\Middleware\WebApi\AppMiddleware::class,
            \App\Http\Middleware\WebApi\VerifiedDomainMiddleware::class,
            'guardswitcher:webapi',
        ],
    ];

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'auth' => \App\Http\Middleware\Authenticate::class,
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        'admin' => AdminMiddleware::class,
        'refresh' => \Linlak\Jwt\Http\Middleware\RefreshToken::class,
        'hassms' => \App\Http\Middleware\WebApi\HasSMSMiddleware::class,
        'sms_enabled' => \App\Http\Middleware\WebApi\SmsEnabledMiddleware::class,
        'funds_enabled' => \App\Http\Middleware\WebApi\FundsEnabledMiddleware::class,
        'payout_enabled' => \App\Http\Middleware\WebApi\PayoutEnabledMiddleware::class,
        'guardswitcher' => \App\Http\Middleware\GuardSwitcher::class,
    ];

    /**
     * The priority-sorted list of middleware.
     *
     * This forces non-global middleware to always be in the given order.
     *
     * @var array
     */
    protected $middlewarePriority = [
        \App\Http\Middleware\GuardSwitcher::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \Linlak\Jwt\Http\Middleware\RefreshToken::class,
        \App\Http\Middleware\Authenticate::class,
        \Illuminate\Session\Middleware\AuthenticateSession::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        \Illuminate\Auth\Middleware\Authorize::class,
        \Nutsweb\LaravelPrerender\PrerenderMiddleware::class,
        \App\Http\Middleware\WebApi\AppMiddleware::class,
        \App\Http\Middleware\WebApi\VerifiedDomainMiddleware::class,
        \App\Http\Middleware\WebApi\SmsEnabledMiddleware::class,
        \App\Http\Middleware\WebApi\HasSMSMiddleware::class,
        \App\Http\Middleware\WebApi\PayoutEnabledMiddleware::class,
        \App\Http\Middleware\WebApi\FundsEnabledMiddleware::class,
        \App\Http\Middleware\OnlineLogger::class,
    ];
}
