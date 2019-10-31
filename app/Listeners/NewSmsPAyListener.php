<?php

namespace App\Listeners;

use App\Events\NewSmsPay;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewSmsPAyListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  NewSmsPay  $event
     * @return void
     */
    public function handle(NewSmsPay $event)
    { }
}
