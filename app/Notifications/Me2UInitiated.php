<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Me2U;
use Illuminate\Support\Str;

class Me2UInitiated extends Notification implements ShouldQueue
{
    use Queueable;
    /**
     * @var App\Me2U
     */
    protected $me2U;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Me2U $me2U)
    {
        //
        $this->me2U = $me2U;
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
            ->line('You have initiated Me2U of ' . $this->me2U->sms_count . ' sms units to ' . Str::title($this->me2U->recipient->fullname))
            ->line('Please send Voucher code to your friend before they can use it.')
            ->line('Voucher code: ' . $this->me2U->sms_voucher)
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
