<?php

namespace App\Providers;


use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        'App\Events\MessageSent' => [
            'App\Listeners\MessageSentListener'
        ],
        'App\Events\PaymentSaved' => [
            'App\Listeners\PaymentSavedListener',
        ],
        'App\Events\MessageFailed' => [
            'App\Listeners\MessageFailedListener',
        ],
        'App\Events\PaymentConfirmed' => [
            'App\Listeners\PaymentConfirmedListener',
        ],
        'App\Events\NewSmsPay' => [
            'App\Listeners\NewSmsPAyListener'
        ],
        'App\Events\UserCreated' => [
            'App\Listeners\SendRegistrationEmail'
        ],
        'App\Events\ActivationFailed' => [
            'App\Listeners\ActivationFailedListener'
        ],

    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents()
    {
        return true;
    }
}
