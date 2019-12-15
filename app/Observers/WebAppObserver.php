<?php

namespace App\Observers;

use App\Events\WebAppCreated;
use App\Events\WebAppDeleted;
use App\Events\WebAppUpdated;
use App\WebApi\WebApp;

class WebAppObserver
{
    /**
     * Handle the web app "created" event.
     *
     * @param  \App\WebApi\WebApp  $webApp
     * @return void
     */
    public function created(WebApp $webApp)
    {
        broadcast(new WebAppCreated($webApp));
    }

    /**
     * Handle the web app "updated" event.
     *
     * @param  \App\WebApi\WebApp  $webApp
     * @return void
     */
    public function updated(WebApp $webApp)
    {
        broadcast(new WebAppUpdated($webApp));
    }

    /**
     * Handle the web app "deleted" event.
     *
     * @param  \App\WebApi\WebApp  $webApp
     * @return void
     */
    public function deleted(WebApp $webApp)
    {
        //
        broadcast(new WebAppDeleted($webApp));
    }

    /**
     * Handle the web app "restored" event.
     *
     * @param  \App\WebApi\WebApp  $webApp
     * @return void
     */
    public function restored(WebApp $webApp)
    {
        //
        broadcast(new WebAppUpdated($webApp));
    }

    /**
     * Handle the web app "force deleted" event.
     *
     * @param  \App\WebApi\WebApp  $webApp
     * @return void
     */
    public function forceDeleted(WebApp $webApp)
    {
        //
        broadcast(new WebAppDeleted($webApp));
    }
}
