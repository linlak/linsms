<?php

namespace App\Observers;

use App\Events\WebAppStatCreated;
use App\Events\WebAppStatDeleted;
use App\WebApi\WebAppStat;

class WebAppStatsObserver
{
    /**
     * Handle the web app stat "created" event.
     *
     * @param  \App\WebApi\WebAppStat  $webAppStat
     * @return void
     */
    public function created(WebAppStat $webAppStat)
    {
        //
        broadcast(new WebAppStatCreated($webAppStat));
    }

    /**
     * Handle the web app stat "updated" event.
     *
     * @param  \App\WebApi\WebAppStat  $webAppStat
     * @return void
     */
    public function updated(WebAppStat $webAppStat)
    {
        //
    }

    /**
     * Handle the web app stat "deleted" event.
     *
     * @param  \App\WebApi\WebAppStat  $webAppStat
     * @return void
     */
    public function deleted(WebAppStat $webAppStat)
    {
        //

    }

    /**
     * Handle the web app stat "restored" event.
     *
     * @param  \App\WebApi\WebAppStat  $webAppStat
     * @return void
     */
    public function restored(WebAppStat $webAppStat)
    {
        //
    }

    /**
     * Handle the web app stat "force deleted" event.
     *
     * @param  \App\WebApi\WebAppStat  $webAppStat
     * @return void
     */
    public function forceDeleted(WebAppStat $webAppStat)
    {
        //
        // broadcast(new WebAppStatDeleted($webAppStat));
    }
}
