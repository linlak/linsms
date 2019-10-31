<?php

namespace App\Services\Traits\Sms;

use App\User;
use Illuminate\Http\Request;
use App\Sms;
use App\QueuedSms;

trait DefersSms
{
    public function deferedSms(Request $request)
    {
        $msgs = [];
        $user = User::with(['pending_sms' => function ($query) {
            $query->orderBy('updated_at', 'desc');
        }])->find($request->user()->id);
        if ($user->pending_sms->count() > 0) {
            for ($i = 0; $i < $user->pending_sms->count(); $i++) {
                $sms = $user->pending_sms[$i];
                $msgs[] = [
                    'id' => encrypt($sms->id),
                    'sender_id' => $sms->sender_id,
                    'status' => $sms->is_sent ? '1' : '0',
                    'chanel_id' => $sms->id,
                    'msg_cnt' => $this->msgCount($sms->message),
                    'recipients' => count($this->cleanContacts($sms->recipients)),
                ];
            }
        }
        $this->_setResults('msgs', $msgs);
        return $this->_showResult();
    }

    public function deferedSingle(Request $request, $id)
    {
        try {
            $sms = QueuedSms::where('user_id', '=', $request->user()->id)->findOrFail((int) decrypt($id));
            $recp = $this->cleanContacts($sms->recipients);
            $msg = [
                'id' => \encrypt($sms->id),
                'sender_id' => $sms->sender_id,
                'message' => $sms->message,
                'recipients' => $recp,
                'msg_len' => strlen($sms->message),
                'chanel_id' => $sms->id,
                'msg_cnt' => $this->msgCount($sms->message),
            ];
            $this->_setResults('sms', $msg);
        } catch (\Exception $e) {
            //show toast and result no sms
        }
        return $this->_showResult();
    }
}
