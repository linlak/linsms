<?php

namespace App\Listeners;

use App\Events\UserCreated;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\ConfirmRegistration;

class SendRegistrationEmail implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 1;
    // public $deleteWhenMissingModels = true;
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
     * @param  UserCreated  $event
     * @return void
     */
    public function handle(UserCreated $event)
    {
        //
        $user = $event->v_code->user;
        if (($user instanceof MustVerifyEmail) && !$user->hasVerifiedEmail()) {
            $user->notify(new ConfirmRegistration($event->v_code));
        }
    }
}
