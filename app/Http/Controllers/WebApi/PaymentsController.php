<?php

namespace App\Http\Controllers\WebApi;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Traits\Sms\SmsCommons;
use App\Services\Traits\WebApi\GuardTrait;

class PaymentsController extends Controller
{
    //
    use SmsCommons, GuardTrait;

    public function __construct()
    {
        $this->is_api = true;
    }

    public function balance(Request $request)
    { }

    public function deposit(Request $request)
    { }

    public function depositStatus(Request $request, $id)
    { }

    public function payout(Request $request)
    { }
    public function payoutStatus(Request $request, $id)
    { }
}
