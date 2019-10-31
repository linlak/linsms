<?php

namespace App\Listeners;

use App\Events\ActivationFailed;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class ActivationFailedListener
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
     * @param  ActivationFailed  $event
     * @return void
     */
    public function handle(ActivationFailed $event)
    {
        //
    }
}
