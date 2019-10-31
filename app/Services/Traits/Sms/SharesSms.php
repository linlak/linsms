<?php

namespace App\Services\Traits\Sms;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Validator;
use App\Rules\AuthUser;
use Illuminate\Support\Str;
use App\Me2U;
use App\Services\Traits\MyVariables;
use App\SmsPayment;
use Illuminate\Support\Facades\Date;
use App\CurPayment;
use App\Notifications\Me2UInitiated;

trait SharesSms
{
    // use MyVariables;
    public function valMe2u(Request $request)
    {
        $this->_enVal();

        $action = $request->input('action');
        switch ($action) {
            case 'initiate':
                $this->sendMe2u($request);
                break;
            case 'activate':
                $this->loadVoucher($request);
                break;
            case 'del':
                $this->removeVoucher($request);
                break;
            default:
                $this->_msg = "Unknown method";
                break;
        }
        if (!\is_null($action)) {
            $this->_setResults('action', $action);
        }
        return $this->_showResult();
    }

    private function sendMe2u(Request $request)
    {

        $user = User::with('cur_pay.payment')->find($request->user()->id);
        if ($user->has_sms && $user->cur_pay->is_active) {
            $this->_validator = Validator::make($request->all(), [
                'name' => ['required', new AuthUser],
                'sms' => ['required', 'numeric', 'min:10'],
            ], [], [
                'name' => "Friend's Id",
                'sms' => 'Sms'
            ]);
            if ($this->_validator->fails()) {
                $this->getErrs();
                return;
            }
            $sms = $request->input('sms');
            $fd = User::with('cur_pay')->smsUser($request->input('name'))
                ->get()->first();
            if ($fd) {
                if ($request->user()->is($fd)) {
                    $this->_msg = "Sorry you cannot send Me2U to yourself (:";
                    return;
                }
                if (!is_null($fd->cur_pay)) {
                    if (!$fd->cur_pay->is_active) {
                        $this->_msg = "User has un resolved issues and can not perform any transactions";
                        return;
                    }
                }
                if ($sms > $user->cur_pay->payment->remaining) {
                    $this->_msg = "You have insuficient sms to share $sms units";
                    return;
                }
                $me2u = new Me2U();
                $me2u->user_id = $user->id;
                $me2u->recipient_id = $fd->id;
                $me2u->sms_count = $sms;
                $me2u->sms_voucher = "Me2U-" . Str::random(5);
                $me2u->save();
                $me2u->refresh();
                $user->notify((new Me2UInitiated($me2u))->delay(\now()->addSeconds(10)));
                $this->_msg = "You have initiated $sms units for " . Str::title($fd->fullname);
                $this->_success_flag = 1;
                $this->_type = "success";
                $this->_setResults('result', ['curTab' => 2]);
            } else {
                $this->_msg = "Friend's Id did not match any of our records (:";
            }
        } else {
            $this->_msg = "You do not have sms to send Me2u";
        }
    }

    private function loadVoucher(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [
            'code' => 'required|alpha_dash|starts_with:Me2U-',
        ], [], [
            'code' => 'Code'
        ]);
        if ($this->_validator->fails()) {
            $this->getErrs();
            return;
        }
        try {
            if ($me2u = Me2U::with(['sender.cur_pay.payment', 'recipient.cur_pay.payment'])->meU($request->input('code'))->where('recipient_id', $request->user()->id)->get()->first()) {
                if (!is_null($me2u->sender->cur_pay)) {
                    if ($me2u->sms_count > $me2u->sender->cur_pay->payment->remaining) {
                        $this->_msg = "Un fortunetly your friend does not have suficient sms units";
                        return;
                    }
                    $pay = new SmsPayment();
                    $pay->me2u_count = $me2u->sms_count;
                    $pay->is_m2u = true;
                    $pay->m2u_id = $me2u->id;
                    $pay->status = '1';
                    $pay->verified_at = Date::now();
                    $pay->p_ref = "SMS-" . Str::random(5);
                    $pay->user_id = $me2u->recipient->id;

                    $s_cur_pay = $me2u->sender->cur_pay->payment;

                    if (!is_null($me2u->recipient->cur_pay) && ($me2u->recipient->cur_pay->payment->remaining > 0)) {
                        $r_c_pay = $me2u->recipient->cur_pay->payment;
                        $pay->sms_brought = $r_c_pay->remaining;
                        $pay->b_frm = $r_c_pay->id;
                        $cur_pay = $me2u->recipient->cur_pay;

                        $r_c_pay->carried_at = Date::now();
                        $r_c_pay->sms_carried = $r_c_pay->remaining;
                        // $r_c_pay->
                        // $r_c_pay->
                        // $r_c_pay->

                        $cur_pay->delete();
                    }

                    $pay->save();
                    $pay->refresh();
                    $s_cur_pay->sms_shared = ($s_cur_pay->sms_shared + $me2u->sms_count);
                    $s_cur_pay->last_used = Date::now();
                    if (isset($r_c_pay)) {

                        // $r_c_pay->
                        $r_c_pay->c_to = $pay->id;
                        $r_c_pay->save();
                    }
                    //update me2u
                    $me2u->from_ref = $s_cur_pay->id;
                    $me2u->to_ref = $pay->id;
                    $me2u->redeemed_at = Date::now();
                    $s_cur_pay->save();

                    $nCurPay = new CurPayment();
                    $nCurPay->user_id = $me2u->recipient->id;
                    $nCurPay->pay_id = $pay->id;
                    $nCurPay->save();
                    $me2u->save();
                    $this->_msg = "Voucher Code loaded successfully :)";
                    $this->_type = "success";
                    $this->_success_flag = 1;
                    $this->_setResults('result', ['curTab' => 3]);
                } else {
                    $this->_msg = "Voucher Code not found (:";
                    $me2u->delete();
                }
            } else {
                $this->_msg = "Voucher Code not found (:";
            }
        } catch (\Exception $e) {
            $this->_msg = "Voucher code not found (:";
        }
    }

    private function removeVoucher(Request $request)
    {
        if ($request->has('id') && $request->has('code')) {
            try {
                $me2u = Me2U::meU($request->input('code'))->where('user_id', $request->user()->id)->findOrFail(\decrypt($request->input('id')));

                $this->_success_flag = 1;
                $this->_msg = "Deleted " . $me2u->sms_voucher;
                $this->_type = "success";

                $me2u->delete();
            } catch (\Exception $e) {
                $this->_msg = "Voucher Code not found (:";
            }
        }
    }
    public function smsShared(Request $request)
    {
        $output = [];
        $user = User::with(['shared_sms' => function ($query) {
            $query->with(['me2u_pay', 'recipient'])->orderBy('updated_at', 'desc');
        }])->find($request->user()->id);
        if ($user->shared_sms->count() > 0) {
            for ($i = 0; $i < $user->shared_sms->count(); $i++) {

                $me2u = $user->shared_sms[$i];
                $output[] = [
                    'id' => \encrypt($me2u->id),
                    'chanel_id' => $me2u->id,
                    'receiver' => $me2u->recipient->username, 'voucher_count' => $me2u->sms_count, 'voucher_code' => $me2u->sms_voucher, 'init_date' => $me2u->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(), 'date_used' => $me2u->redeemed ? $me2u->redeemed_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString() : '', 'is_used' => $me2u->redeemed ? '1' : '0', 'from_ref' => $me2u->me2u_pay ? $me2u->me2u_pay->p_ref : ''
                ];
            }
        }

        $this->_setResults('shared', $output);
        return $this->_showResult();
    }

    public function smsReceived(Request $request)
    {
        $output = [];
        $user = User::with(['recieved_sms' => function ($query) {
            $query->with(['me2_pay', 'sender'])->orderBy('updated_at', 'desc')->whereNotNull('redeemed_at');
        }])->find($request->user()->id);
        if ($user->recieved_sms->count() > 0) {
            for ($i = 0; $i < $user->recieved_sms->count(); $i++) {
                # code...
                $me2u = $user->recieved_sms[$i];
                $output[] = [
                    'sender' => $me2u->sender->username, 'voucher_count' => $me2u->sms_count, 'voucher_code' => $me2u->sms_voucher, 'init_date' => $me2u->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(), 'date_used' => $me2u->redeemed ? $me2u->redeemed_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString() : '', 'is_used' => $me2u->redeemed ? '1' : '0',
                    'chanel_id' => $me2u->id, 'to_ref' => $me2u->me2_pay ? $me2u->me2_pay->p_ref : ''
                ];
            }
        }

        $this->_setResults('received', $output);
        return $this->_showResult();
    }
}
