<?php

namespace App\Notifications;

use App\ActivationCode;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class ConfirmRegistration extends Notification implements ShouldQueue
{
    use Queueable;
    /**
     * @var \App\ActivationCode
     * 
     */
    protected $v_code;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(ActivationCode $v_code)
    {
        //
        $this->v_code = $v_code;
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
            ->line('Your account has been created successfully.')
            ->line('Please copy code and enter it in the verification form to activate your Account')
            ->line('Code: ' . $this->v_code->v_code)
            ->line('Or')
            ->line('Click button below to view the form.')
            ->action('Verifiction Form', url('/verification-code/' . $this->v_code->v_code))
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
