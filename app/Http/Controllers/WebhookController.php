<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\EasyPay;
use App\SmsPayment;
use App\Services\Traits\Sms\SmsActivation;
use App\Jobs\PayReceived;
use App\Services\Traits\Sms\SmsCommons;

class WebhookController extends Controller
{
    use SmsActivation, SmsCommons;

    public function easyPay(Request $request)
    {

        $reference = (int) $request->json('reference');
        $transactionId = $request->json('transactionId');
        $amount = $request->json('amount');
        $reason = $request->json('reason');
        $phone = $request->json('phone');
        // dispatch(new PayReceived($reason));
        $easy = EasyPay::with('easable')->find($reference);
        if (!is_null($easy)) {
            if (!is_null($easy->easable)) {
                $easy->transactionId = $transactionId;
                $easy->verified = true;
                $easy->save();
                if ($easy->easable_type === $easy->getActualClassNameForMorph(SmsPayment::class)) {
                    $payment = $easy->easable;
                    if (!$payment->is_current) {
                        $payment->phone = $phone;
                        $payment->trans_id = $transactionId;
                        $payment->pay_mtd = "easypay";
                        $this->activateSms($payment);
                    }
                }
            } else {
                $easy->delete();
            }
        }
        return response()->json(compact('refrence', 'transactionId', 'amount', 'reason', 'phone'));
    }
}
