<?php

namespace App\Services;

use App\WesocketApp;
use BeyondCode\LaravelWebSockets\Apps\App;
use BeyondCode\LaravelWebSockets\Apps\AppProvider;

class MyAppProvider implements AppProvider
{

    public function __construct()
    { }

    /**  @return array[\BeyondCode\LaravelWebSockets\AppProviders\App] */
    public function all(): array
    {
        return WesocketApp::all()
            ->map(function (WesocketApp $wesocketApp) {
                return $this->instanciate($wesocketApp);
            })
            ->toArray();
    }

    public function findById($appId): ?App
    {
        $wesocketApp = WesocketApp::where('id', $appId)->get()->first();

        return $this->instanciate($wesocketApp);
    }

    public function findByKey(string $appKey): ?App
    {
        $wesocketApp = WesocketApp::where('app_key', $appKey)->get()->first();

        return $this->instanciate($wesocketApp);
    }

    public function findBySecret(string $appSecret): ?App
    {
        $wesocketApp = WesocketApp::where('app_secret', $appSecret)->get()->first();

        return $this->instanciate($wesocketApp);
    }

    protected function instanciate(?WesocketApp $wesocketApp): ?App
    {
        if (!$wesocketApp) {
            return null;
        }

        $app = new App(
            $wesocketApp->id,
            $wesocketApp->app_key,
            $wesocketApp->app_secret
        );

        $app->setName($wesocketApp->app_name);

        if (!is_null($wesocketApp->app_host)) {
            $app->setHost($wesocketApp->app_host);
        }

        $app
            ->enableClientMessages($wesocketApp->enable_client_messages)
            ->enableStatistics($wesocketApp->enable_statistics)
            ->setCapacity($wesocketApp->capacity ?? null);

        return $app;
    }
}
