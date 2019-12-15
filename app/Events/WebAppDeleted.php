<?php

namespace App\Events;

use App\WebApi\WebApp;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class WebAppDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $webApp;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(WebApp $webApp)
    {
        //
        $this->webApp = $webApp;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return [
            new PrivateChannel('App.User.' . $this->webApp->user->id),
            new PrivateChannel("admin.apps"),
        ];
    }
    public function broadcastWith()
    {
        return [
            'id' => $this->web_app->id,
        ];
    }

    public function broadcastAs()
    {
        return 'webapp.deleted';
    }
}
