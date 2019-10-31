<?php

namespace App\Services\Traits\Sms;

use App\QueuedSms;
use App\Services\Conf\WebConf;
use App\Sms;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;

trait SendsSms
{
    /**
     * @var App\USer
     */
    private $p_user;

    private function valSend(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [
            'message' => 'required|max:' . (WebConf::MSG_WRD_CNT * WebConf::MSG_CNT),
            'sender_id' => 'required|max:' . WebConf::MSG_ID,
            'recipients' => 'required',
            'hours' => [
                'required_if:shouldQueue,true', 'numeric', 'min:0', 'max:24'
            ],
            'minutes' => [
                'required_if:shouldQueue,true',
                'required_if:hours,0', 'numeric',
                // 'hours_not_zero:hours:0',
                'min:0', 'max:60'
            ]
        ], [], [
            'shouldQueue' => 'message delivery',
            'hours' => 'Hours',
            'minutes' => 'Minutes'
        ]);
        if ($this->_validator->fails()) {
            $this->getErrs();
            return;
        }
        if ((bool) $request->input('shouldQueue')) {
            if (((int) $request->input('hours') === 0) && ((int) $request->input('minutes') === 0)) {
                $this->_setResults('errs', ['minutes' => ['The Minutes must be at least 1 if Hours is 0']]);
                return false;
            }
        }
        return true;
    }
    public function sendMesage(Request $request)
    {
        $this->_enVal();
        $this->_setResults('action', 'send');
        if ($this->valSend($request)) {
            $sender_id = $request->input('sender_id');
            $message = $request->input('message');
            $recipients = $request->input('recipients');
            $recipients = $this->cleanContacts($recipients);
            if (($vrecipents = count($recipients)) == 0) {
                $this->_setResults('errs', ['recipients' => ['Comma Separeted Phone Numbers Please']]);
                return $this->_showResult();
            }
            $this->payUser($request);
            if ($this->p_user->has_sms) {
                if ($this->p_user->cur_pay->is_active) {
                    // $msg_len = strlen($message);
                    $msg_cnt = $this->msgCount($message);

                    if (($this->p_user->cur_pay->payment->remaining > 0) && ($this->p_user->cur_pay->payment->remaining >= ($vrecipents * $msg_cnt))) {
                        $queued = false;
                        if (false === (bool) $request->input('shouldQueue')) {
                            if ($msg_resp = $this->sendSmsText($sender_id, $message, \join(',', $recipients))) {
                                $sms = new Sms();
                                $sms->user_id = $this->p_user->id;
                                $sms->is_sent = true;
                                $sms->sent_at = Date::now();
                                $sms->pay_id = $this->p_user->cur_pay->payment->id;
                                $sms->sender_id = $sender_id;
                                $sms->message = $message;
                                $sms->recipients = \join(',', $recipients);
                                $sms->sms_before = $this->p_user->cur_pay->payment->remaining;
                                $sms->sms_after = ($this->p_user->cur_pay->payment->remaining - $vrecipents * $msg_cnt);
                                $sms->sent_sms = $vrecipents * $msg_cnt;
                                if ($sms->save()) {
                                    $payment = $this->p_user->cur_pay->payment;
                                    $payment->sms_used = ($payment->sms_used + ($vrecipents * $msg_cnt));
                                    $payment->last_used = Date::now();
                                    $payment->save();
                                }

                                $this->_msg = 'SMS sent successfully :)';
                                $this->_type = "success";
                                $this->_success_flag = 1;
                            } else {
                                $this->_msg = 'System under maintanence try again later!!..';
                            }
                        } else {

                            $smsToQueue = new QueuedSms();
                            $smsToQueue->sender_id = $sender_id;
                            $smsToQueue->user_id = $this->p_user->id;
                            $smsToQueue->message = $message;
                            $smsToQueue->recipients = join(',', $recipients);
                            $smsToQueue->schedule_time = Date::now()->addHours((int) $request->input("hours"))->addMinutes((int) $request->input('minutes'));
                            $smsToQueue->save();
                            $queued = true;
                            $this->_type = "success";
                            $this->_success_flag = 1;
                            $this->_msg = "Message scheduled to run at " . $smsToQueue->schedule_time->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString();
                        }

                        $this->_setResults('queued', $queued);
                    } else {
                        $this->_msg = "Sorry... You have insuficient SMS to send " . ($vrecipents * $msg_cnt) . " SMS to " . $vrecipents . " recipients (:";
                    }
                } else {
                    $this->_msg = 'Your payment is suspended (:';
                }
            } else {
                $this->no_pay();
            }

            //get users payment
        }

        return $this->_showResult();
    }
    public function sentSms(Request $request)
    {
        $msgs = [];
        $user = User::with(['sms' => function ($query) {
            $query->with('payment')->orderBy('updated_at', 'desc');
        }])->find($request->user()->id);
        if ($user->sms->count() > 0) {
            for ($i = 0; $i < $user->sms->count(); $i++) {
                $sms = $user->sms[$i];
                $msgs[] = [
                    'id' => encrypt($sms->id),
                    'chanel_id' => $sms->id,
                    'p_id' => \encrypt($sms->payment->id),
                    'p_ref' => $sms->payment->p_ref,
                    'sender_id' => $sms->sender_id,
                    'status' => $sms->is_sent ? '1' : '0',
                    'sms_sent' => $sms->sent_sms,
                    // 'sms_sent' => $sms->sms_sent,
                    'sent_date' => $sms->sent_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
                    'msg_cnt' => $this->msgCount($sms->message),
                    'recipients' => count($this->cleanContacts($sms->recipients)),
                    'sms_failed' => $sms->failed_sms
                ];
            }
        }
        $this->_setResults('msgs', $msgs);
        return $this->_showResult();
    }
    /**
     * @param Illuminate\Http\Request
     * 
     * @return void
     */
    private function payUser(Request $request)
    {
        $this->p_user = User::with('cur_pay.payment')->find($request->user()->id);
    }

    public function sentSingle(Request $request, $id)
    {
        try {
            $sms = Sms::with('payment')->where('user_id', '=', $request->user()->id)->findOrFail((int) decrypt($id));
            $msg = [
                'id' => \encrypt($sms->id),
                'chanel_id' => $sms->id,
                'sender_id' => $sms->sender_id,
                'message' => $sms->message,
                'p_ref' => $sms->payment ? $sms->payment->p_ref : '',
                'recipients' => $this->cleanContacts($sms->recipients),
                'msg_len' => strlen($sms->message),
                'sms_before' => $sms->sms_before,
                'sms_after' => $sms->sms_after,
                'sms_sent' => $sms->sent_sms,
                'sms_failed' => $sms->failed_sms,
                'msg_cnt' => $this->msgCount($sms->message),
                'sent_date' => $sms->sent_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
                'recpct' => floor($sms->sent_sms / $this->msgCount($sms->message))

            ];
            $this->_setResults('sms', $msg);
        } catch (\Exception $e) {
            //show toast and result no sms
        }
        return $this->_showResult();
    }
}
