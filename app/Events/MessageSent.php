<?php

namespace App\Events;

use App\Services\Traits\Sms\SmsCommons;
use App\Sms;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent
{
    use Dispatchable, InteractsWithSockets, SerializesModels, SmsCommons;
    public $sms;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Sms $sms)
    {
        //
        $this->sms = $sms;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('App.User.' . $this->sms->user->id);
    }
    public function broadcastAs()
    {
        return 'sms.sent';
    }
}
