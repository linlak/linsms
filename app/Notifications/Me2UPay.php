<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\SmsPayment;
use Illuminate\Support\Str;
use Illuminate\Queue\InteractsWithQueue;

class Me2UPay extends Notification implements ShouldQueue
{
    use Queueable, InteractsWithQueue;
    protected $smsPayment;
    public $tries = 2;
    public $deleteWhenMissingModels = true;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(SmsPayment $smsPayment)
    {
        //
        $this->smsPayment = $smsPayment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->success()
            ->greeting('Hi ' . Str::title($notifiable->fullname))
            ->subject('Voucher code loaded successfully.')
            ->line('You have loaded Voucher code ' . $this->smsPayment->received->sms_voucher)
            ->line('Details')
            ->line('Voucher code: ' . $this->smsPayment->received->sms_voucher)
            ->line('Ref: ' . $this->smsPayment->p_ref)
            ->line('Received: ' . $this->smsPayment->received->sms_count)
            ->line('Total SMS: ' . $this->smsPayment->total)
            ->line('Available SMS: ' . $this->smsPayment->remaining)
            ->line('Please login to start sending bulk sms with us.')
            ->action('Login', url('/login.html'))
            ->line('Thank you for choosing us.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
