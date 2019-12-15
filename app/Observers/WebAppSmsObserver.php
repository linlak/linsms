<?php

namespace App\Observers;

use App\Events\WebAppSmsCreated;
use App\WebApi\WebAppSms;

class WebAppSmsObserver
{
    /**
     * Handle the web app sms "created" event.
     *
     * @param  \App\WebApi\WebAppSms  $webAppSms
     * @return void
     */
    public function created(WebAppSms $webAppSms)
    {
        //
        broadcast(new WebAppSmsCreated($webAppSms));
    }

    /**
     * Handle the web app sms "updated" event.
     *
     * @param  \App\WebApi\WebAppSms  $webAppSms
     * @return void
     */
    public function updated(WebAppSms $webAppSms)
    {
        //
    }

    /**
     * Handle the web app sms "deleted" event.
     *
     * @param  \App\WebApi\WebAppSms  $webAppSms
     * @return void
     */
    public function deleted(WebAppSms $webAppSms)
    {
        //
    }

    /**
     * Handle the web app sms "restored" event.
     *
     * @param  \App\WebApi\WebAppSms  $webAppSms
     * @return void
     */
    public function restored(WebAppSms $webAppSms)
    {
        //
    }

    /**
     * Handle the web app sms "force deleted" event.
     *
     * @param  \App\WebApi\WebAppSms  $webAppSms
     * @return void
     */
    public function forceDeleted(WebAppSms $webAppSms)
    {
        //
    }
}
