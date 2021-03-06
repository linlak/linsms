<?php

namespace App\Events;

use App\Services\Traits\Sms\SmsCommons;
use App\SmsPayment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewSmsPay implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels, SmsCommons;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $smsPayment;
    public function __construct(SmsPayment $smsPayment)
    {
        //
        $this->smsPayment = $smsPayment;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('App.User.' . $this->smsPayment->user->id);
    }

    public function broadcastAs()
    {
        return 'payment.created';
    }

    public function broadcastWith()
    {
        return $this->smsPayPasser($this->smsPayment, true);
    }
}
