<?php

namespace App\Events;

use App\OnlineClient;
use App\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OnlineStatisticsChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('lin');
    }

    public function broadcastAs()
    {
        return 'online.stats';
    }

    public function broadcastWith()
    {
        return [
            'connections' => OnlineClient::all()->count(),
            'users' => User::where(function ($query) {
                $query->whereHas('clients', function ($query) {
                    $query->where('user_id', '!=', NULL);
                });
            })->get()->count(),
        ];
    }
}
