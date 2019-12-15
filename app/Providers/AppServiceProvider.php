<?php

namespace App\Providers;

use App\Observers\OnlineClientObserver;
use App\Observers\SmsPaymentObserver;
use App\Observers\WebAppSmsObserver;
use App\Observers\WebAppStatsObserver;
use App\OnlineClient;
use App\Services\AppGuard;
use App\SmsPayment;
use App\WebApi\WebAppSms;
use App\WebApi\WebAppStat;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        Schema::defaultStringLength(191);
        Queue::before(function (JobProcessing $event) { });
        Queue::after(function (JobProcessed $event) { });
        Queue::looping(function () {
            while (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
        });

        $this->registerObservers();
        Validator::extend('hours_not_zero', function ($attribute, $value, $parameters, $validator) {
            return true;
        });
        Auth::extend('web_apps', function ($app, $name, array $config) {
            return new AppGuard(Auth::createUserProvider($config['provider']), $app->make('request'));
        });
    }

    private function registerObservers()
    {
        SmsPayment::observe(SmsPaymentObserver::class);
        OnlineClient::observe(OnlineClientObserver::class);
        WebAppSms::observe(WebAppSmsObserver::class);
        WebAppStat::observe(WebAppStatsObserver::class);
    }
}
