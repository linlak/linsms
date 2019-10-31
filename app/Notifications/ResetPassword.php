<?php

namespace App\Notifications;

use App\ActivationCode;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPassword extends Notification implements ShouldQueue
{
    use Queueable;
    public $tries = 2;
    /**
     * @var \App\ActivationCode
     */
    protected $activationCode;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(ActivationCode $activationCode)
    {
        $this->activationCode = $activationCode;
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
            ->line('Hi ' . Str::title($notifiable->fullname))
            ->line('You have requested to recover your password.')
            ->line('Please copy code and enter it in the verification form to reset your password')
            ->line('Code: ' . $this->v_code->v_code)
            ->line('Or')
            ->line('Click button below to view the form.')
            ->action('Verifiction Form', url('/verification-code/' . $this->v_code->v_code))
            ->line('If you did not request to recover your password, don\'t do anything.')
            ->line('Thank you for choosing us!');
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
