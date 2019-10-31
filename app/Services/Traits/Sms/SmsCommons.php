<?php

namespace App\Services\Traits\Sms;

use App\Services\Conf\WebConf;
use App\Phonebook;
use App\Sms;
use Illuminate\Http\Request;
use App\Services\Traits\MyVariables;
use App\Services\Traits\Easy\PayEasyTrait;

trait SmsCommons
{
    use MyVariables, BuysSms, CreatesPhoneBook, RetrievesPhoneBook, SendsSms, SharesSms, DefersSms, PayEasyTrait;

    public function showCal()
    {
        $output = [
            "id_len" => WebConf::MSG_ID,
            "msg_cnt" => WebConf::MSG_CNT,
            "wrd_cnt" => WebConf::MSG_WRD_CNT
        ];
        $this->_setResults('cal', $output);
        return $this->_showResult();
    }

    public function priceValues()
    {
        $this->_setResults('values', $this->smsBuyForm());
        return $this->_showResult();
    }
    public function parseNumbers(Request $request)
    {
        $this->_enVal();

        $action = $request->input('action');
        $this->_msg = "Contacts filtered successfully :)";
        $this->_setResults('action', $action);
        $this->_success_flag = 1;
        $this->_type = "success";
        switch ($action) {
            case 'upload':
            case 'count':
                if ($contacts = $request->input('contacts')) {
                    $output = $this->cleanContacts($contacts);
                    $this->_setResults('recipients', $output);
                }
                break;
            case 'usephonebook':
                $id = $request->input('id');
                $output = [];
                if (count($id) > 0) {
                    $ids = \array_map(function ($item) {
                        return \decrypt($item);
                    }, $id);
                    $fd = Phonebook::where('user_id', '=', $request->user()->id)->whereIn('id', $ids)->get();
                    if ($fd->count() > 0) {
                        for ($i = 0; $i < $fd->count(); $i++) {
                            $output = array_merge($output, $this->cleanContacts(($fd[$i])->contacts));
                        }
                    }
                }
                $this->_setResults('recipients', $output);
                break;
            case 'resend':
            case 'reuse':
                $id = $request->input('id');
                $output = [];
                if (count($id) > 0) {
                    $id =  (int) \decrypt($id[0]);
                    $sms = Sms::where('user_id', '=', $request->user()->id)->find($id);
                    if ($sms) {
                        if ($action === 'reuse') {
                            $this->_setResults('recipients', $this->cleanContacts($sms->recipients));
                        } else {
                            $output = [
                                'sender_id' => $sms->sender_id,
                                'message' => $sms->message,
                                'recipients' => $this->cleanContacts($sms->recipients)
                            ];
                            $this->_setResults('sms', $output);
                        }
                    }
                }

                break;
            default:
        }
        return $this->_showResult();
    }
}
