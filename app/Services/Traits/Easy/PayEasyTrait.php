<?php

namespace App\Services\Traits\Easy;

use App\SmsPayment;
use App\Jobs\PayEasyJob;
use App\EasyPay;

trait PayEasyTrait
{

    public function deferEasy(SmsPayment $smspay, $p_phone)
    {
        $easy = new EasyPay();
        $easy->phone = $p_phone;
        $easy->amount = $smspay->sms_price;
        $easy->reason = $smspay->p_ref;
        $easy->easable_id = $smspay->id;
        $easy->easable_type = $easy->getActualClassNameForMorph(SmsPayment::class);
        $easy->save();
        $easy->refresh();
        \dispatch(new PayEasyJob($easy));
    }

    public function requestPayment($ref, $amount, $phone, $reason, $currency = "UGX")
    {
        $payload = [
            'action' => 'mmdeposit',
            'amount' => $amount,
            'phone' => $phone,
            'currency' => $currency,
            'reference' => $ref,
            'reason' => $reason
        ];
        return $this->handlePayRequest($payload);
    }
    public function checkBalance()
    {
        return $this->handlePayRequest([
            "action" => "checkbalance"
        ]);
    }

    private function handlePayRequest($payload)
    {
        $data = array_merge([
            'username' => config('payeasy.client_id'),
            'password' => config('payeasy.secret'),
        ], $payload);
        // return $data;
        //open connection 
        $ch = curl_init();
        //set the url, number of POST vars, POST data 
        curl_setopt($ch, CURLOPT_URL, config('payeasy.pay_link'));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
        curl_setopt($ch, CURLOPT_TIMEOUT, 400); //timeout in seconds 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        //execute post 
        $result = curl_exec($ch);
        $info = curl_getinfo($ch);
        //close connection 
        curl_close($ch);
        if ($info['http_code'] === 200) {
            return \json_decode($result, true);
        }
        return false;
    }

    public function makePayment($amount, $phone, $reason)
    {
        $payload = \array_merge($this->easy_payload, [
            'action' => 'mmpayout',
            'amount' => $amount,
            'phone' => $phone,
            'reason' => $reason
        ]);
        return $this->handlePayRequest($payload);
    }
}
