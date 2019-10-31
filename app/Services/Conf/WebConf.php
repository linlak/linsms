<?php

namespace App\Services\Conf;

class WebConf
{

    //help numbers
    const MTN_HELP_LINE = " 0783 198 167";
    const AIRTEL_HELP_LINE = "0751 921 465";
    const AFRICELL_HELP_LINE = "0793 835 583";
    const SMART_HELP_LINE = "0741 650 019";
    const EMAIL_HELP_LINE = "info@lin-sms.com";
    const WEB_LINK =  "lin-sms.com";
    //payment methods
    const PAY_MTDS = "Mobile Money/ Payway/ Bank/ Paypal";
    const MTN_MACH_NO = "000000";
    const AIRTEL_MACH_NO = "000000";
    const SMART_MACH_NO = "000000";
    const ORANGE_MACH_NO = "000000";
    //sms app coonection settings
    // const SEND_URL = "http://boxuganda.com/api.php";
    // const BAL_URL = "http://boxuganda.com/balance.php?";
    //sms app coonection settings
    const SMS_API = "http://smswindow.net";
    const SEND_URL = self::SMS_API . "/webapi.php";
    const BAL_URL = self::SMS_API . "/checkbal.php?";
    const SMS_NAME_KEY = "user";
    const SMS_PAS_KEY = "password";
    const SMS_ID_KEY = "sender";
    const SMS_MSG_KEY = "message";
    const SMS_RCVR_KEY = "reciever";
    //sms
    const MSG_WRD_CNT = 160;
    const MSG_CNT = 2;
    const MSG_ID =  10;
    // sms pay cal
    const SMSMIN = 5000;
    const SMSMINP = 40;
    const SMSMINP1 = 35;
    const SMSMINP2 = 30;
    const SMSMINP3 = 25;
    const SMSMIN0 = 125;
    const SMSMIN1 = 500;
    const SMSMIN2 = 1000;
    const SMSMIN3 = 10000;
    const SMSMINR = '125 - 499';
    const SMSMINR1 = '500 - 999';
    const SMSMINR2 = '1000 - 9999';
    const SMSMINR3 = '10000+';
    // accessToken
    const CLR_KEY = 'accessStatus';
    const TOKEN_KEY = 'accessToken';
    //data ecryption settings
    const ENCRYPT_MTD = "AES-256-CBC";
    //should never be changed
    const SECRET_KEY = "NDJlYmM1NDVhNWMxYTg3N2ZmZTI5NmMwN2Q4ZWZhNWY=";
    const SECRET_IV = "OWFlNjhiNzVlYzA1MDZiNGQ5MzEyZDJkNjE3ZTdlYzQ=";


    public static function getTableClm(String $values)
    {
        if (filter_var($values, FILTER_VALIDATE_EMAIL)) {
            return 'email';
        } elseif (self::valphone($values)) {
            return 'phone';
        }
        return 'username';
    }
    public static function valphone($string)
    {
        $string = filter_var($string, FILTER_SANITIZE_NUMBER_INT);
        $string = str_replace('-', '', $string);
        if (preg_match('/^[+]?([\d]{0,3})?[\(\.\-\s]?([\d]{3})[\)\.\-\s]*([\d]{3})[\.\-\s]?([\d]{4})$/', $string)) {
            return TRUE;
        }
        return FALSE;
    }
}
