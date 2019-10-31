<?php

namespace App\Services\Traits\Admin\Sms;

use App\SmsPayment;
use Illuminate\Http\Request;
use App\Me2U;

trait  RetrievesPayments
{

    public function allPayments()
    {
        $output = [];
        $sub_title = 'All payments';
        $fd = SmsPayment::with('user')->orderBy('updated_at', 'DESC')->get();
        if ($fd->count() > 0) {

            foreach ($fd as $payment) {
                $output[] = [
                    'p_id' => \encrypt($payment->id),
                    'p_ref' => $payment->p_ref,
                    'chanel_id' => $payment->id,
                    'sms_price' => (int) $payment->sms_price,
                    'sms_count' => (int) $payment->sms_count,
                    'start_date' => $payment->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
                    'verify' => $payment->verified_at ? $payment->verified_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString() : '',
                    'username' => $payment->user->username,
                ];
            }
        }
        $this->_setResults('sub_title', $sub_title);
        $this->_setResults('payments', $output);
        return $this->_showResult();
    }
    public function parsePayment(SmsPayment $payment)
    {
        $output = [];
        $output = [
            'p_id' => \encrypt($payment->id),
            'chanel_id' => $payment->id,
            'p_ref' => $payment->p_ref,
            'sms_price' => (int) $payment->sms_price,
            'sms_count' => (int) $payment->sms_count,
            'verify' => $payment->verified_at ? $payment->verified_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString() : '',
            'start_date' => $payment->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
            'username' => $payment->user->username,
            'status' => $payment->status,

        ];
        if (!\is_null($payment->cur_pay)) {
            $output = array_merge($output, [
                'isCur' => true,
                'isUsable' => $payment->cur_pay->is_active ? '1' : '0',
                'reason' => $payment->cur_pay->reason,
            ]);
        }
        $this->_setResults('payment', $output);
    }
    public function payment(Request $request, $id)
    {
        try {
            $p_id = \decrypt($id);

            $payment = SmsPayment::with(['user', 'cur_pay'])->findOrFail($p_id);
            $this->parsePayment($payment);
        } catch (\Exception $e) {
            $this->no_pay();
        }
        return $this->_showResult();
    }

    public function me2U(Request $request)
    {
        $output = [];
        $me2u = Me2U::with(['sender', 'recipient', 'me2_pay', 'me2u_pay'])->orderBy('updated_at', 'desc')->get();
        if ($me2u->count() > 0) {
            foreach ($me2u as $data) {
                $output[] = [
                    'sender' => $data->sender->username,
                    'chanel_id' => $data->id,
                    'recipient' => $data->recipient->username,
                    'sms_count' => $data->sms_count,
                    'v_code' => $data->sms_voucher,
                    'to_ref' => $data->me2_pay ? $data->me2_pay->p_ref : '',
                    'frm_ref' => $data->me2u_pay ? $data->me2u_pay->p_ref : '',
                    'status' => $data->redeemed
                ];
            }
        }
        $this->_setResults('me2u', $output);
        return $this->_showResult();
    }
}
