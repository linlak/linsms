<?php

namespace App\Http\Controllers;

use App\Services\Traits\Sms\SmsCommons;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Rules\Phone;
use App\SmsPayment;

class SmsController extends Controller
{
    //

    use SmsCommons;

    public function __construct()
    {
        // $this->middleware('auth')->except([]);
        $this->userLocation();
    }
    public function payNow(Request $request)
    {
        $this->_enVal();
        if ($this->valPayNow($request)) {
            try {
                $smspay = SmsPayment::with(['cur_pay', 'easy_pay'])->findOrFail(\decrypt($request->input('id')));
                if (!\is_null($smspay)) {
                    if (!$smspay->is_current) {
                        if (is_null($smspay->easy_pay)) {
                            $this->deferEasy($smspay, $this->p_phone);
                            $this->_msg = "Payment request has been sent enter pin to confirm";
                            $this->_type = "success";
                            $this->_success_flag = 1;
                            $this->smsPayPasser($smspay);
                        } else {
                            $this->_msg = "Payment request already sent";
                            $this->_type = "success";
                            $this->_success_flag = 1;
                            $this->smsPayPasser($smspay);
                        }
                    } else {
                        $this->_msg = "Payment is already verified";
                        $this->_type = "success";
                        $this->_success_flag = 1;
                        $this->smsPayPasser($smspay);
                    }
                } else {
                    $this->no_pay();
                }
            } catch (\Exception $e) {
                $this->no_pay();
            }
        }

        return $this->_showResult();
    }
    private function valPayNow(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [
            'p_phone' => ['required', new Phone]
        ]);
        if ($this->_validator->fails()) {
            $this->getErrs();
            return false;
        }
        return $this->setPhone($request);
    }
}
