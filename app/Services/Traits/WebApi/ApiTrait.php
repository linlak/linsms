<?php

namespace App\Services\Traits\WebApi;

use App\Services\Traits\Sms\SmsCommons;
use App\WebApi\WebAppSms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;

trait ApiTrait
{
    use SmsCommons, GuardTrait;
    public function balance()
    {
        if ($this->guard()->user()->has_sms) {
            $this->_setResults('balance', $this->guard()->user()->cur_pay->payment->remaining);
        }
        $this->_apimsg = "OK";
        $this->app_log($this->guard()->web_app(), "Checked balance", "success");
        return $this->_showResult();
    }

    public function send(Request $request)
    {
        if ($this->valApiSend($request)) {
            $sender_id = $request->input('sender_id');
            $message = $request->input('message');
            $recipients = $this->cleanContacts($request->input('recipients'));
            $this->performSend($sender_id, $message, $recipients);
        }
        return $this->_showResult();
    }
    private function valApiSend(Request $request)
    {
        $this->_validator = Validator::make($request->all(['sender_id', 'message', 'recipients']), [
            'sender_id' => 'required|string|max:10',
            'message' => 'required|string',
            'recipients' => 'required|string',
        ]);
        if ($this->_validator->fails()) {
            $this->_status = 400;
            $this->_apimsg = 'missing or invalid fields in your request';
            $this->app_log($this->guard()->web_app(), "Error sending message. \n Reason:\n" . $this->_apimsg, "error");
            return false;
        }
        return true;
    }

    private function performSend($sender_id, $message, $recipients)
    {
        if (($vrecipents = count($recipients)) === 0) {
            $this->_status = 400;
            $this->_apimsg = "The recipients fields must have at least one valid ugandan number or comma separeted ugandan number";
            $this->app_log($this->guard()->web_app(), "Error sending message. \n Reason:\n" . $this->_apimsg, "error");
            return;
        }
        if ($this->guard()->user()->has_sms) {
            if ($this->guard()->user()->cur_pay->is_active) {
                $msg_count = $this->msgCount($message);
                if (($this->guard()->user()->cur_pay->payment->remaining > 0) && ($this->guard()->user()->cur_pay->payment->remaining >= ($vrecipents * $msg_count))) {
                    if ($msg_resp = $this->sendSmsText($sender_id, $message, \join(',', $recipients))) {
                        $sms = new WebAppSms();
                        $sms->app_id = $this->guard()->web_app()->id;
                        $sms->is_sent = true;
                        $sms->sent_at = Date::now();
                        $sms->pay_id = $this->guard()->user()->cur_pay->payment->id;
                        $sms->sender_id = $sender_id;
                        $sms->message = $message;
                        $sms->recipients = \join(',', $recipients);
                        $sms->sms_before = $this->guard()->user()->cur_pay->payment->remaining;
                        $sms->sms_after = ($this->guard()->user()->cur_pay->payment->remaining - $vrecipents * $msg_count);
                        $sms->sent_sms = $vrecipents * $msg_count;
                        if ($sms->save()) {
                            $payment = $this->guard()->user()->cur_pay->payment;
                            $payment->sms_used = ($payment->sms_used + ($vrecipents * $msg_count));
                            $payment->last_used = Date::now();
                            $payment->save();
                        }
                        $sms->refresh();
                        $this->_apimsg = 'sent';
                        $this->_setResults('result', [
                            'sent' => $sms->sent_sms,
                            'failed' => $sms->failed_sms,
                            'refrenceId' => $sms->id,
                        ]);
                        $this->app_log($this->guard()->web_app(), "SMS sent successfully", "success");
                    } else {
                        $this->_status = 500;
                        $this->_apimsg = "System error please try again";
                        $this->app_log($this->guard()->web_app(), "Error sending message. \n Reason:\n" . $this->_apimsg, "error");
                    }
                } else {
                    $this->_status = 402;
                    $this->_apimsg = "you have insuficient credits to send " . ($vrecipents * $msg_count) . " sms";
                    $this->app_log($this->guard()->web_app(), "Error sending message. \n Reason:\n" . $this->_apimsg, "error");
                }
            } else {
                $this->_status = 403;
                $this->_apimsg = "can not send sms due to unresolved issues";
                $this->app_log($this->guard()->web_app(), "Error sending message. \n Reason:\n" . $this->_apimsg, "error");
            }
        } else {
            $this->_status = 402;
            $this->_apimsg = "No SMS";
            $this->app_log($this->guard()->web_app(), "Error sending message. \n Reason:\n" . $this->_apimsg, "error");
        }
    }

    public function sentStatus(Request $request, $id)
    {
        return $this->_showResult();
    }
}
