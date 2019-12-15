<?php

namespace App\Events;

use App\WebApi\WebAppStat;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class WebAppStatDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $webAppStat;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(WebAppStat $webAppStat)
    {
        //
        $this->webAppStat = $webAppStat;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('WebApp.Stats.' . $this->webAppStat->web_app->id);
    }
    public function broadcastWith()
    {
        return [
            'id' => $this->webAppStat->id,
        ];
    }

    public function broadcastAs()
    {
        return 'webapp.stat_deleted';
    }
}
