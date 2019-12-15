<?php

namespace App\Events;

use App\ActivationCode;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var \App\ActivationCode
     */
    public $v_code;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(ActivationCode $v_code)
    {
        //
        $this->v_code = $v_code;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('admin');
    }
    public function broadcastAs()
    {
        return 'user.created';
    }
}
