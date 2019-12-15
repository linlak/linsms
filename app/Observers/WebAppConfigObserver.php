<?php

namespace App\Observers;

use App\WebApi\WebAppConfig;

class WebAppConfigObserver
{
    /**
     * Handle the web app config "created" event.
     *
     * @param  \App\WebApi\WebAppConfig  $webAppConfig
     * @return void
     */
    public function created(WebAppConfig $webAppConfig)
    {
        //
    }

    /**
     * Handle the web app config "updated" event.
     *
     * @param  \App\WebApi\WebAppConfig  $webAppConfig
     * @return void
     */
    public function updated(WebAppConfig $webAppConfig)
    {
        //
    }

    /**
     * Handle the web app config "deleted" event.
     *
     * @param  \App\WebApi\WebAppConfig  $webAppConfig
     * @return void
     */
    public function deleted(WebAppConfig $webAppConfig)
    {
        //
    }

    /**
     * Handle the web app config "restored" event.
     *
     * @param  \App\WebApi\WebAppConfig  $webAppConfig
     * @return void
     */
    public function restored(WebAppConfig $webAppConfig)
    {
        //
    }

    /**
     * Handle the web app config "force deleted" event.
     *
     * @param  \App\WebApi\WebAppConfig  $webAppConfig
     * @return void
     */
    public function forceDeleted(WebAppConfig $webAppConfig)
    {
        //
    }
}
