<?php

namespace App\Services\Traits\Admin\Sms;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\SmsPayment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use App\User;
use App\CurPayment;
use Illuminate\Support\Str;
use App\Notifications\SmsPaymentApproved;
use App\Rules\Phone;
use App\Services\Traits\MyVariables;

trait ActivatesPayments
{
    // use MyVariables;
    use RetrievesPayments;
    /**
     * @var \App\SmsPayment
     */
    private $v_pay = null;
    /**
     * @var \App\User
     */
    private $v_user = null;

    public function valPayment(Request $request)
    {
        $this->_enVal();
        $action = $request->input('action');
        $this->getVpay($request);
        if (!is_null($this->v_pay)) {
            switch ($action) {
                default:
                    $this->_msg = "Unknown call (:";
                    break;
                case 'activate':
                    $this->activatePayment($request);
                    break;
                case 'suspend':
                    $this->suspendPayment($request);
                    break;
                case 'reactivate':
                    $this->reactivatePayment($request);
                    break;
                case 'del':
                    $this->deletePayment($request);
                    break;
            }
        } else {
            $this->no_pay();
        }
        $this->_setResults('action', $action);
        return $this->_showResult();
    }
    private function getVpay(Request $request)
    {
        $p_id = \decrypt($request->input('p_id'));

        $this->v_pay = SmsPayment::find((int) $p_id);
    }
    private function getVUser($id)
    {

        $this->v_user = User::with('cur_pay.payment')->find((int) $id);
    }
    private function activatePayment(Request $request)
    {
        $this->_validator = $this->validateActivation($request);
        if ($this->_validator->fails()) {
            $this->_setResults('errs', $this->_validator->errors());
            return;
        }
        $this->getVUser($this->v_pay->user_id);

        if (!is_null($this->v_user->cur_pay)) {
            $cur_pay = $this->v_user->cur_pay;
            $payment = $this->v_user->cur_pay->payment;
            if (!$cur_pay->is_active) {
                $this->_msg = "User has a blocked payment (:";
                return;
            }
            if ($payment->remaining > 0) {
                $this->v_pay->b_frm = $payment->id;
                $this->v_pay->sms_brought = $payment->remaining;


                $payment->carried_at = Date::now();
                $payment->last_used = Date::now();
                $payment->sms_carried = $payment->remaining;
                $payment->c_to = $this->v_pay->id;
                $payment->save();
            }

            $cur_pay->delete();
        }
        // return;
        //activation
        $this->v_pay->status = '1';
        $this->v_pay->phone = $request->input('p_phone');
        $this->v_pay->admin_id = Auth::user()->admin->id;
        $this->v_pay->verified_at = Date::now();
        $this->v_pay->pay_mtd = $request->input('p_mtd');
        $this->v_pay->trans_id = ($request->input('p_mtd') === 'cash') ? Str::random(9) : $request->input('trans_id');
        $this->v_pay->save();
        $this->v_pay->refresh();
        $cur_pay = new CurPayment();
        $cur_pay->user_id = $this->v_user->id;
        $cur_pay->pay_id = $this->v_pay->id;
        $cur_pay->save();
        $this->v_user->notify((new SmsPaymentApproved($this->v_pay))->delay(now()->addSeconds(10)));
        $this->_success_flag = 1;
        $this->_type = "success";
        $this->_msg = "Payment verified successfully";
        $this->parsePayment($this->v_pay);
    }

    private function validateActivation(Request $request)
    {
        return Validator::make($request->all(), [
            'p_mtd' => ['required'],
            'p_phone' => ['required', new Phone],
            'trans_id' => ['required_unless:p_mtd,cash'],
        ]);
    }

    private function suspendPayment(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [
            'reason' => 'required'
        ]);
        if ($this->_validator->fails()) {
            $this->getErrs();
            return;
        }
        $cur_pay = $this->v_pay->cur_pay;
        $cur_pay->reason = $request->input('reason');
        $cur_pay->is_active = false;
        $cur_pay->save();
        $this->v_pay->refresh();
        $this->parsePayment($this->v_pay);
        $this->_success_flag = 1;
        $this->_type = "success";
        $this->_msg = "Payment suspended successfully";
    }

    private function reactivatePayment(Request $request)
    {
        $cur_pay = $this->v_pay->cur_pay;
        $cur_pay->reason = null;
        $cur_pay->is_active = true;
        $cur_pay->save();
        $this->v_pay->refresh();
        $this->parsePayment($this->v_pay);
        $this->_success_flag = 1;
        $this->_type = "success";
        $this->_msg = "Payment reactivated successfully";
    }

    private function deletePayment(Request $request)
    {
        if ($this->v_pay->is_current && $this->v_pay->cur_pay->is_active) {
            $this->_msg = "Sorry this payment cannot be deleted";
            return;
        }
    }
}
