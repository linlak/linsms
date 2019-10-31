<?php

namespace App\Listeners;

use App\Events\PaymentSaved;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class PaymentSavedListener
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
     * @param  PaymentSaved  $event
     * @return void
     */
    public function handle(PaymentSaved $event)
    {
        //
    }
}
