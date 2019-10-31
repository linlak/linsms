<?php

namespace App\Notifications;

use App\SmsPayment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Str;

class NewSmsPay extends Notification implements ShouldQueue
{
    use Queueable, InteractsWithQueue;
    public $smspayment;
    public $tries = 2;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(SmsPayment $smsPayment)
    {
        $this->smspayment = $smsPayment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        //mail database broadcast,nexmo,slack
        // return ['mail'];
        return [
            'database',
            'broadcast',
            //  'mail'
        ];
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
            ->greeting('Hi ' . Str::title($notifiable->fullname))
            ->subject('Payment Initiated')
            ->line('You have initiated a payment of UGX:' . \number_format($this->smspayment->sms_price))
            ->line('Your account will be credited with  ' . $this->smspayment->sms_count . ' sms')
            ->line('Please login to view your payment details')
            ->action('Login', url('/login.html'))
            ->line('Thank you for choosing us.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        return [
            'payment' => $this->smspayment
        ];
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
            'payment' => [
                'id', $this->smspayment->id,
            ],
        ];
    }
}
