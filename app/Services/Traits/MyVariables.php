<?php

namespace App\Services\Traits;

use App\Services\Conf\WebConf;
use App\Services\Traits\Sms\ParseContacts;
use Illuminate\Support\Facades\Auth;

trait MyVariables
{
    use LinValidators, ParseContacts;
    /**
     * @var \Torann\GeoIP\Location
     */
    protected $my_location = null;
    /**
     * @var array
     */
    protected $_result = [];
    /**
     * @var \App\User|\null
     */
    protected $c_user = null;
    /**
     * @var int
     */
    protected $_status = 200;
    /**
     * @var boolean
     */
    private $ref_token = false;
    /**
     * @var \Illuminate\Contracts\Validation\Validator
     */
    protected $_validator;
    /**
     * @var string
     */
    protected $_msg = "Please fix a few things and try again... ";
    /**
     * @var string
     */
    protected $_apimsg = "Unknown error";
    /**
     * @var string
     */
    protected $_type = "danger";
    /**
     * @var boolean
     */
    private $_msgDisabled = false;
    /**
     * @var boolean
     */
    private $_enToast = false;
    /**
     * @var boolean
     */
    private $_enVal = false;
    /**
     * @var int
     */
    protected $_success_flag = 0;
    /**
     * @var string
     */
    private $_flag = 'success_flag';
    protected $is_api = false;
    public function userLocation()
    {
        $this->my_location = geoip()->getLocation(geoip()->getClientIP());
    }
    /**
     * @return void
     */

    protected function _showToast()
    {
        $this->_enToast = true;
        $this->_disMsg();
    }
    /**
     * @return void
     */
    protected function _disMsg()
    {
        $this->_msgDisabled = true;
    }
    /**
     * @return void
     */
    protected function _enRef()
    {
        $this->ref_token = true;
    }
    /**
     * @param string [$sCheckHost]
     * @return boolean
     */
    public function check_internet_connection($sCheckHost = 'www.google.com')
    {
        return (bool) @fsockopen($sCheckHost, 80, $iErrno, $sErrStr, 5);
    }
    /**
     * @return void
     */
    protected function _disToast()
    {
        $this->_enToast = false;
    }
    /**
     * @return void
     */
    protected function _enMsg()
    {
        $this->_msgDisabled = false;
        $this->_disToast();
    }
    /**
     * @return void
     */
    public function getErrs()
    {
        $this->_setResults('errs', $this->_validator->errors());
    }
    /**
     * @param string $type
     * @param string $msg
     * @param string|boolean $title
     * @return array
     */
    public function msg($type, $msg, $title = false)
    {
        $res = ['type' => $type, 'msg' => $msg];
        if (false !== $title) {
            $res['title'] = $title;
        }
        return $res;
    }
    /**
     * @return void
     */
    protected function _enVal()
    {
        $this->_enVal = true;
    }
    /**
     * @return void
     */
    protected function _disVal()
    {
        $this->_enVal = false;
    }
    /**
     * @return void
     */
    protected function _setResults($key, $value)
    {

        $this->_result[$key] = $value;
    }

    protected function _showResult()
    {
        if ($this->_enVal) {
            $this->_setResults($this->_flag, $this->_success_flag);
            if (!$this->_msgDisabled) {
                $this->_setResults('msg', $this->msg($this->_type, $this->_msg));
            }
            if ($this->_enToast) {
                $this->_setResults('toast', $this->msg($this->_type, $this->_msg));
            }
        }
        if (!$this->ref_token && !$this->is_api) {
            if (Auth::shouldRefresh()) {
                if (Auth::check()) {
                    $this->_setResults(WebConf::TOKEN_KEY, Auth::token());
                }
            }
        }
        if ($this->is_api) {
            $this->_setResults('status', $this->_status);
            $this->_setResults('message', $this->_apimsg);
        }
        return \response()->json($this->_result, $this->_status);
    }
    /**
     * @return array
     */
    protected function smsBuyForm()
    {
        $output = array(
            "minp" => WebConf::SMSMINP,
            "minv" => WebConf::SMSMIN0,
            "minp1" => WebConf::SMSMINP1,
            "minv1" => WebConf::SMSMIN1,
            "minp2" => WebConf::SMSMINP2,
            "minv2" => WebConf::SMSMIN2,
            "minp3" => WebConf::SMSMINP3,
            "minv3" => WebConf::SMSMIN3
        );

        return $output;
    }
    /**
     * 
     */
    public function genRss($title, $description, $link, $copyright, array $items)
    {
        $channel = compact('title', 'description', 'link', 'copyright');
        $items = (!empty($items) && is_array($items)) ? $items : [];
        $output = '<?xml version="1.0" encoding="ISO-8859-1"';
        $output .= '<rss version="2.0">';
        $output .= '<channel>';
        foreach ($channel as $key => $value) {
            $output .= '<' . strtolower(stripslashes($key)) . '>' . $value . '</' . strtolower(stripslashes($key)) . '>';
        }
        foreach ($items as $item) {
            if (!empty($item)) {
                $output .= '<item>';
                foreach ($item as $item_key => $item_value) {
                    $output .= '<' . strtolower(stripslashes($item_key)) . '>' . $item_value . '</' . strtolower(stripslashes($item_key)) . '>';
                }
                $output .= '</item>';
            }
        }
        $output .= '</channel>';
        $output .= '</rss>';
        return $output;
    }
    /**
     * @return int
     */
    protected function msgCount($msg)
    {
        $msg_cnt = 1;
        $msg_len = strlen($msg);
        if (WebConf::MSG_WRD_CNT < $msg_len && $msg_len <= WebConf::MSG_WRD_CNT * WebConf::MSG_CNT) {
            $msg_cnt = WebConf::MSG_CNT;
        }
        return $msg_cnt;
    }
    /**
     * @return void
     */
    protected function no_pay()
    {
        $this->no_data("Payment not found");
    }
    /**
     * @return void
     */
    protected function no_data($msg)
    {
        $this->_msg = $msg;
        $this->_setResults('no_data', true);
    }
    /**
     * @return void
     */
    protected function comingSoon()
    {
        $this->_msg = "Coming soon";
        $this->_type = "info";
    }
}
