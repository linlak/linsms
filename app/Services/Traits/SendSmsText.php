<?php

namespace App\Services\Traits;

use App\Services\Conf\WebConf;

trait SendSmsText
{

    final public function getBalance()
    {
        if (!function_exists('curl_init')) {
            return false;
        }
        // Get cURL resource
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => WebConf::BAL_URL . WebConf::SMS_NAME_KEY . '=' . \config('linsms.sms_name') . '&' . WebConf::SMS_PAS_KEY . '=' . \config('linsms.sms_pass'),
            CURLOPT_USERAGENT => 'LinSms 1.0'
        ));
        // Send the request & save response to $resp
        $resp = curl_exec($curl);
        $info = curl_getinfo($curl);
        // Close request to clear up some resources
        curl_close($curl);
        // Log::debug(\json_encode(['send message' => $info, 'output' => $resp]));
        if ($info['http_code'] === 200) {
            return $resp;
        } else {
            return false;
        }
    }

    final public function sendSmsText($sender_id, $msg, $recp)
    {
        if (!function_exists('curl_init') && empty($senderParams)) {
            return false;
        }
        $authParams = array(WebConf::SMS_NAME_KEY => config('linsms.sms_name'), WebConf::SMS_PAS_KEY => config('linsms.sms_pass'), WebConf::SMS_MSG_KEY => \urlencode($msg), WebConf::SMS_ID_KEY => \urlencode($sender_id), WebConf::SMS_RCVR_KEY => $recp);
        $postfields = array();
        foreach ($authParams as $key => $value) {
            $fields_string = $key . '=' . $value;
            $postfields[] = $fields_string;
        }

        $vpostfields = join('&', $postfields);

        $curld = curl_init();
        curl_setopt_array($curld, array(
            CURLOPT_POST => true,
            CURLOPT_USERAGENT => 'LinSms 1.0',
            CURLOPT_POSTFIELDS => $vpostfields,
            CURLOPT_URL => WebConf::SEND_URL,
            CURLOPT_RETURNTRANSFER => true
        ));

        $output = curl_exec($curld);
        $info = curl_getinfo($curld);
        curl_close($curld);
        // Log::debug(\json_encode(['send message' => $info, 'output' => $output]));
        if ($info['http_code'] === 200 && ((int) substr($output, 0, 4) == 1701 && $output !== 'no balance')) {
            return $output;
        } else {
            return false;
        }
    }
}
