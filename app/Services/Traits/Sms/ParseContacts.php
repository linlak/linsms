<?php
namespace App\Services\Traits\Sms;

use App\Services\Traits\LinHelpers;

trait ParseContacts
{
    public function cleanContacts($contacts)
    {
        $nums = [];
        $line = $this->multiexplode(array(",", "\n", "\r", " ", "\t"), $contacts);
        foreach ($line as $row) {
            array_push($nums, $this->rep_text('+', '', htmlentities(preg_replace('/^0/', 256, $this->cleanTabs($row)))));
        }
        if ($nums) {
            $nums = array_values(array_unique($this->cleanArr($nums)));
        }
        return $nums;
    }
}
