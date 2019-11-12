<?php

namespace App\Http\Controllers;

use App\Services\Conf\WebConf;
use App\Services\Traits\MyVariables;
use Illuminate\Http\Request;

class MainController extends Controller
{
    use MyVariables;
    public function contacts()
    {
        $contacts = [
            'AIRTEL_HELP_LINE' => WebConf::AIRTEL_HELP_LINE,
            'MTN_HELP_LINE' => WebConf::MTN_HELP_LINE,
            // ''=>,
            // ''=>,
        ];
        $this->_setResults('contacts', $contacts);
        return $this->_showResult();
    }
    public function prices()
    {
        $priceList = array();
        $priceList[] = array('minunts' => WebConf::SMSMINR, 'unitp' => WebConf::SMSMINP, 'minno' => WebConf::SMSMIN0);
        $priceList[] = array('minunts' => WebConf::SMSMINR1, 'unitp' => WebConf::SMSMINP1, 'minno' => WebConf::SMSMIN1);
        $priceList[] = array('minunts' => WebConf::SMSMINR2, 'unitp' => WebConf::SMSMINP2, 'minno' => WebConf::SMSMIN2);
        $priceList[] = array('minunts' => WebConf::SMSMINR3, 'unitp' => WebConf::SMSMINP3, 'minno' => WebConf::SMSMIN3);
        $this->_setResults('priceList', $priceList);
        return $this->_showResult();
    }

    public function showRss()
    {
        $items = [['title' => 'Head light bulb', 'description' => '', 'link' => '', 'price' => '22 USD']];
        $output = $this->genRss('LinSMS services', '', 'https://lin-sms.com', 'Copyright (C) 2018 lin-sms.com. All rights reserved', $items);
        header("Content-Type: application/rss+xml; charset=ISO-8859-1");
        echo ($output);
    }
    public function gallery()
    {
        $output = [['id' => 1, 'url' => 'http://localhost/images/linsms.png']];
        $this->_setResults('images', $output);
        return $this->_showResult();
    }
}
