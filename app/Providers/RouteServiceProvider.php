<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapWebApiRoutesSubDomain();
        $this->mapWebApiRoutes();
        $this->mapApiRoutes();
        $this->mapDevRoutes();
        $this->mapWebRoutes();

        //
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    }
    /**
     * Define the "webapi" routes the application.
     * 
     * These routes typically stateless.
     * 
     * @return void
     */
    protected function mapWebApiRoutes()
    {

        Route::prefix('webapi')
            ->namespace($this->namespace)
            ->middleware('webapi')
            // ->
            ->group(base_path('routes/webapi.php'));
    }
    /**
     * Define the "webapi" routes the application.
     * 
     * These routes typically stateless.
     * 
     * @return void
     */
    protected function mapWebApiRoutesSubDomain()
    {

        Route::domain('webapi.lin-sms.com')
            ->namespace($this->namespace)
            ->middleware('webapi')
            ->group(base_path('routes/webapi.php'));
    }
    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));
    }
    /**
     * Define the "developer" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapDevRoutes()
    {
        Route::prefix('developers')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/developer.php'));
    }
}
