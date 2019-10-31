<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Me2U;
use Illuminate\Support\Str;
use Illuminate\Queue\InteractsWithQueue;

class VoucherLoaded extends Notification implements ShouldQueue
{
    use Queueable, InteractsWithQueue;
    public $tries = 3;
    public $deleteWhenMissingModels = true;
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
            ->line(Str::title($this->me2U->recipient->fullname) . ' has redeemed sms Voucher code: ' . $this->me2U->sms_voucher)
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
