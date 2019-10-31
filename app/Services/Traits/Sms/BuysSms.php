<?php

namespace App\Services\Traits\Sms;

use App\Events\NewSmsPay;
use App\Rules\Phone;
use App\Services\Conf\WebConf;
use App\SmsPayment;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

trait BuysSms
{

    protected $sms_count = 0;
    protected $sms_price = 0;
    protected $p_phone = "";
    protected $pay_now = false;
    public function setPhone(Request $request)
    {
        $this->p_phone = $this->rep_text('+', '', htmlentities(\preg_replace('/^0/', 256, $request->input('p_phone'))));
        if (!preg_match('/2567[0-9]{8}$/', $this->p_phone)) {
            $this->_setResults('errs', ['p_phone' => ['Enter a valid Ugandan phone number']]);
            return false;
        }
        return true;
    }
    public function buysms(Request $request)
    {
        $this->_enVal();

        $this->_validator = Validator::make($request->all(), [
            'sms_count' => 'required|numeric|min:' . WebConf::SMSMIN0 . '|max:1000000',
            'p_phone' => ['nullable', 'string', new Phone(false)]
        ], [], [
            'pay_now' => 'Pay Now'
        ]);

        if ($this->_validator->fails()) {
            $this->_setResults('errs', $this->_validator->errors());
            return $this->_showResult();
        }
        $this->sms_count = (int) $request->input('sms_count');
        // $this->pay_now =  $request->input('pay_now');

        if (WebConf::valphone($request->input('p_phone')) === true) {
            if (!$this->setPhone($request)) {

                return $this->_showResult();
            }
            $this->pay_now = true;
        }
        // $this->_msg = $this->p_phone;
        // 
        if ($pay = $this->calc_count()) {

            $this->_success_flag = 1;
            $this->_type = 'success';
            $this->_msg = "Payment has been Initiated :)";
        } else {
            $this->_msg = "Error occured try again";
        }
        return $this->_showResult();
    }

    public function calc_count()
    {

        if ($this->sms_count <= (WebConf::SMSMIN1 - 1)) {
            $this->sms_price = WebConf::SMSMINP * $this->sms_count;
        } else {
            if ($this->sms_count <= (WebConf::SMSMIN2 - 1)) {
                $this->sms_price = WebConf::SMSMINP1 * $this->sms_count;
            } else {
                if ($this->sms_count <= (WebConf::SMSMIN3 - 1)) {
                    $this->sms_price = WebConf::SMSMINP2 * $this->sms_count;
                } else {
                    if ($this->sms_count >= (WebConf::SMSMIN3)) {
                        $this->sms_price = WebConf::SMSMINP3 * $this->sms_count;
                    }
                }
            }
        }
        return $this->insertSms();
    }
    private function insertSms()
    {
        $smspay = new SmsPayment();
        $smspay->user_id = Auth::id();
        $smspay->sms_count = $this->sms_count;
        $smspay->sms_price = $this->sms_price;
        $smspay->p_ref = 'SMS-' . Str::random(5);
        $smspay->save();
        $smspay->refresh()->with('user');
        if ($this->pay_now === true) {
            //call payment gateway
            $this->deferEasy($smspay, $this->p_phone);
        }
        event(new NewSmsPay($smspay));
        return $smspay;
    }
    public function singlePayment(Request $request, $id)
    {
        try {
            $pay = SmsPayment::with(['admin.user', 'carried', 'brought'])->where('user_id', '=', $request->user()->id)->findOrFail((int) decrypt($id));
            if (!\is_null($pay)) {
                $this->smsPayPasser($pay);
            } else {
                $this->no_pay();
            }
        } catch (\Exception $e) {
            $this->no_pay();
        }
        return $this->_showResult();
    }
    protected function smsPayPasser(SmsPayment $pay, $broadcating = false)
    {
        $output = [
            'p_id' => encrypt($pay->id),
            'chanel_id' => $pay->id,
            'sms_count' => $pay->sms_count,
            'is_m2u' => $pay->is_m2u,
            'me2u_count' => $pay->me2u_count,
            'remaining' => $pay->remaining,
            'total' => $pay->total,
            'p_ref' => $pay->p_ref,
            'sms_price' => $pay->sms_price,
            'status' => (int) $pay->status,
            'start_date' => ($broadcating) ? $pay->created_at->toDayDateTimeString() : $pay->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
        ];
        if ($output['status'] !== 0) {
            $output = array_merge($output, [
                'verify' => $pay->verified_at ? $pay->verified_at->toDayDateTimeString() : '',
                'c_date' => $pay->carried_at ? $pay->carried_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString() : '',
                'b_fwd' => $pay->sms_brought,
                'c_fwd' => $pay->sms_carried,
                'phone' => $pay->phone,
                'trans_id' => $pay->trans_id,
                'ntwk' => Str::title($pay->pay_mtd),
                'verify_by' => (($pay->admin) && ($pay->admin->user)) ? Str::title($pay->admin->user->fullname) : '',
                'b_frm' => $pay->brought ? \encrypt($pay->brought->id) : '',
                'b_frm_ref' => $pay->brought ? $pay->brought->p_ref : '',
                'c_to_ref' => $pay->carried ? $pay->carried->p_ref : '',
                'c_to' => $pay->carried ? \encrypt($pay->carried->id) : '',
                'used' => $pay->sms_used,
                'shared_sms' => $pay->sms_shared
            ]);
        }
        if ($broadcating) {
            return $output;
        }
        $this->_setResults('payment', $output);
    }
    public function allpayments(Request $request)
    {
        $payments = [];
        $user = User::with(['payments' => function ($query) {
            $query->orderBy('created_at', 'DESC');
        }])->withCount('payments')->find($request->user()->id);
        if ($user->payments_count > 0) {
            for ($i = 0; $i < count($user->payments); $i++) {
                $payment = $user->payments[$i];
                $payments[] = [
                    'p_id' => \encrypt($payment->id),
                    'chanel_id' => $payment->id,
                    'sms_count' => $payment->sms_count,
                    'is_m2u' => $payment->is_m2u,
                    'me2u_count' => $payment->me2u_count,
                    'remaining' => $payment->remaining,
                    'total' => $payment->total,
                    'p_ref' => $payment->p_ref,
                    'sms_price' => $payment->sms_price,
                    'status' => (int) $payment->status,
                    'start_date' => $payment->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
                ];
            }
        }
        $this->_setResults('payments', $payments);
        return $this->_showResult();
    }
}
