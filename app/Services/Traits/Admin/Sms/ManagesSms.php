<?php

namespace App\Services\Traits\Admin\Sms;

use App\Sms;
use Illuminate\Http\Request;

trait ManagesSms
{
    public function allSms(Request $request)
    {
        $output = [];
        $sms = Sms::with(['user', 'payment'])->orderBy('updated_at', 'desc')->get();
        if ($sms->count() > 0) {
            foreach ($sms as $data) {
                $cnt = count($this->cleanContacts($data->recipients));
                $msg_cnt = $this->msgCount($data->message);
                $output[] = [
                    'id' => $data->id,
                    'chanel_id' => $data->id,
                    'sender_id' => $data->sender_id,
                    'username' => $data->user->username,
                    'recpct' => $cnt,
                    'unitsbefore' => $data->sms_before,
                    'unitsAfter' => $data->sms_after,
                    'unitsSpent' => $data->sent_sms,
                    'sentDate' => $data->sent_at ? $data->sent_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString() : '',
                    'msg_cnt' => $msg_cnt,
                    'msg_len' => strlen($data->message),
                    'p_ref' => $data->payment->p_ref
                ];
            }
        }
        $this->_setResults('smslist', $output);
        return $this->_showResult();
    }
}
