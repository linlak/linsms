<?php

namespace App\Listeners;

use App\Events\MessageFailed;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class MessageFailedListener
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
     * @param  MessageFailed  $event
     * @return void
     */
    public function handle(MessageFailed $event)
    {
        //
    }
}
