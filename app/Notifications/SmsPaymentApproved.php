<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\SmsPayment;
use Illuminate\Support\Str;

class SmsPaymentApproved extends Notification implements ShouldQueue
{
    use Queueable;

    protected $smsPayment;
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
            ->greeting('Hi ' . Str::title($notifiable->fullname))
            ->line('Your payment has been Approved successfully.')
            ->line('Details:-')
            ->line('Ref: ' . $this->smsPayment->p_ref)
            ->line('SMS: ' . $this->smsPayment->sms_count)
            ->line('Price: ' . number_format($this->smsPayment->sms_price) . '/=')
            ->line('Brought foward: ' . $this->smsPayment->sms_brought)
            ->line('Total: ' . $this->smsPayment->total)
            ->line('Initiated: ' . $this->smsPayment->created_at->toDayDateTimeString())
            ->line('Verified: ' . $this->smsPayment->verified_at->toDayDateTimeString())
            ->action('Login', url('/login.html'))
            ->line('Thank you for choosing us');
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
