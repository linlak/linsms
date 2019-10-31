<?php

namespace App\Observers;

use App\Events\OnlineStatisticsChanged;
use App\OnlineClient;

class OnlineClientObserver
{
    /**
     * Handle the online client "created" event.
     *
     * @param  \App\OnlineClient  $onlineClient
     * @return void
     */
    public function created(OnlineClient $onlineClient)
    {
        //
        \event(new OnlineStatisticsChanged());
    }

    /**
     * Handle the online client "updated" event.
     *
     * @param  \App\OnlineClient  $onlineClient
     * @return void
     */
    public function updated(OnlineClient $onlineClient)
    {
        //
        \event(new OnlineStatisticsChanged());
    }

    /**
     * Handle the online client "deleted" event.
     *
     * @param  \App\OnlineClient  $onlineClient
     * @return void
     */
    public function deleted(OnlineClient $onlineClient)
    {
        //
        event(new OnlineStatisticsChanged());
    }

    /**
     * Handle the online client "restored" event.
     *
     * @param  \App\OnlineClient  $onlineClient
     * @return void
     */
    public function restored(OnlineClient $onlineClient)
    {
        //
    }

    /**
     * Handle the online client "force deleted" event.
     *
     * @param  \App\OnlineClient  $onlineClient
     * @return void
     */
    public function forceDeleted(OnlineClient $onlineClient)
    {
        //
        event(new OnlineStatisticsChanged());
    }
}
