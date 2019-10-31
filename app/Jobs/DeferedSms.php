<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Sms;
use App\Services\Traits\Sms\SmsCommons;
use App\QueuedSms;
use Illuminate\Support\Facades\Date;

class DeferedSms implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, SmsCommons;
    public $tries = 3;
    public $deleteWhenMissingModels = true;
    // public 
    protected $sms;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(QueuedSms $sms)
    {
        //
        $this->sms = $sms;
        $this->delay(5);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->sms->loadMissing(['user.cur_pay.payment']);
        if (!is_null($this->sms->user->has_sms)) {
            if ($this->sms->user->cur_pay->is_active) {
                $sender_id = $this->sms->sender_id;
                $message = $this->sms->message;
                $recipients = $this->cleanContacts($this->sms->recipients);
                if (($vrecipients = count($recipients)) > 0) {
                    $msg_cnt = $this->msgCount($message);
                    if ($this->sms->user->cur_pay->payment->remaining > 0 && ($this->sms->user->cur_pay->payment->remaining >= ($vrecipients * $msg_cnt))) {
                        if ($msg_resp = $this->sendSmsText($sender_id, $message, \join(',', $recipients))) {
                            $sentSms = new Sms();

                            $sentSms->user_id = $this->sms->user->id;

                            $sentSms->message = $message;
                            $sentSms->sender_id = $sender_id;
                            $sentSms->recipients = \join(",", $recipients);

                            $sentSms->pay_id = $this->sms->user->cur_pay->payment->id;
                            $sentSms->sms_before = $this->sms->user->cur_pay->payment->remaining;
                            $sentSms->sms_after = ($this->sms->user->cur_pay->payment->remaining - ($vrecipients * $msg_cnt));

                            $sentSms->sent_at = Date::now();
                            $sentSms->is_sent = true;
                            $sentSms->sent_sms = $vrecipients * $msg_cnt;
                            if ($sentSms->save()) {
                                $payment = $this->sms->user->cur_pay->payment;
                                $payment->sms_used = ($payment->sms_used + ($vrecipients * $msg_cnt));
                                $payment->last_used = Date::now();
                                $payment->save();
                                $this->sms->delete();
                                return true;
                            }
                        } else {
                            $this->markFailed(true);
                        }
                    } else {
                        $this->markFailed();
                    }
                } else {
                    $this->markFailed();
                }
            } else {
                $this->markFailed();
            }
        } else {
            $this->markFailed();
        }
    }

    private function markFailed($dontFail = false)
    {
        $this->sms->failed = !$dontFail;
        $this->sms->tries = $this->sms->tries + 1;
        $this->sms->is_queued = false;
        if ($this->sms->tries === 3) {
            $this->sms->failed = true;
        }
        $this->sms->save();
    }
}
