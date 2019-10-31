<?php
namespace App\Services\Traits;

trait LinHelpers
{
    use SendSmsText;

    final public function multiexplode($delimiters, $string)
    {
        $ready = str_replace($delimiters, $delimiters[0], $string);
        $launch = explode($delimiters[0], $ready);
        return  $launch;
    }

    final public function rep_text($value1, $value2, $value3)
    {
        $output = str_replace($value1, $value2, $value3);
        return $output;
    }

    final public function cleanTabs($value)
    {
        return preg_replace('/(\n\r)+|\r+|\n+|\t+/i', '', $value);
    }

    // filter out requiered numbers only
    final public function cleanArr($value)
    {
        $value = array_filter($value, function ($item) {
            return preg_match('/2567[0-9]{8}$/', $item);
        });
        return $value;
    }

    function check_internet_connection($sCheckHost = 'www.google.com')
    {
        return (bool)@fsockopen($sCheckHost, 80, $iErrno, $sErrStr, 5);
    }
}
