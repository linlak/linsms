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

class WebAppCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var \App\WebApi\WebApp
     */
    public $web_app;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(WebApp $web_app)
    {
        $this->web_app = $web_app;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return [
            new PrivateChannel('WebApps.' . $this->web_app->user->id),
            new PrivateChannel("admin.apps"),
        ];
    }
    public function broadcastWith()
    {
        return [
            'app_name' => $this->web_app->app_name,
            'created_at' => $this->web_app->created_at->toDayDateTimeString(),
            'updated_at' => $this->web_app->updated_at->toDayDateTimeString(),
            'id' => encrypt($this->web_app->id),
            'ws_id' => $this->web_app->id
        ];
    }

    public function broadcastAs()
    {
        return 'webapp.created';
    }
}
