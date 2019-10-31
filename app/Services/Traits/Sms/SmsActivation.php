<?php

namespace App\Services\Traits\Sms;

use App\SmsPayment;
use Illuminate\Support\Facades\Date;
use App\CurPayment;
use App\Notifications\SmsPaymentApproved;

trait SmsActivation
{
    public function activateSms(SmsPayment $smsPayment)
    {
        if (!$smsPayment->is_current) {
            $user = $smsPayment->user;
            $user->loadMissing('cur_pay.payment');
            $smsPayment->status = '1';
            $smsPayment->verified_at = Date::now();

            if ($user->has_sms) {
                $payment = $user->cur_pay->payment;
                if ($payment->remaining > 0) {
                    $smsPayment->sms_brought = $payment->remaining;
                    $smsPayment->b_frm = $payment->id;

                    //curpay
                    $payment->c_to = $smsPayment->id;
                    $payment->sms_carried = $payment->remaining;
                    $payment->carried_at = Date::now();
                    $payment->save();
                }
                $cur_pay = $user->cur_pay;
                $cur_pay->delete();
            }
            $smsPayment->save();
            $nCurPay = new CurPayment();
            $nCurPay->user_id = $user->id;
            $nCurPay->pay_id = $smsPayment->id;
            $nCurPay->save();
            $user->notify((new SmsPaymentApproved($smsPayment))->delay(now()->addSeconds(10)));
        }
    }
}
