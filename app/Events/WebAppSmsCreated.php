<?php

namespace App\Events;

use App\WebApi\WebAppSms;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Support\Str;

class WebAppSmsCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $webAppSms;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(WebAppSms $webAppSms)
    {
        //
        $this->webAppSms = $webAppSms;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('WebApp.Sms.' . $this->webAppSms->web_app->id);
    }
    public function broadcastWith()
    {
        return [
            "id" => $this->webAppSms->id,
            "sent_sms" => $this->webAppSms->sent_sms,
            "failed_sms" => $this->webAppSms->failed_sms,
            "sms_len" => Str::length($this->webAppSms->message),
            "sender_id" => $this->webAppSms->sender_id,
        ];
    }

    public function broadcastAs()
    {
        return 'webapp.sms_created';
    }
}
