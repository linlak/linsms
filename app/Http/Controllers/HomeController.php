<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Traits\Easy\PayEasyTrait;
use App\Services\Traits\MyVariables;

class HomeController extends Controller
{
    use PayEasyTrait, MyVariables;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
        $this->userLocation();
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }
    public function testPayment()
    {
        set_time_limit(0);
        $result = $this->requestPayment(7, 500, '256785370140', 'sms-erfyf');
        $this->_setResults('easy', $result);
        return $this->_showResult();
    }
    public function balance()
    {
        $result = $this->checkBalance();
        $this->_setResults('easy', $result);
        return $this->_showResult();
    }
}
