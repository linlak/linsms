<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use App\Services\Traits\MyVariables;
use Illuminate\Support\Facades\Validator;
use App\Rules\AuthUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Services\Conf\WebConf;
use App\Services\Traits\Auth\ForgotPasswordTrait;

class ForgotPasswordController extends Controller

{

    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    use ForgotPasswordTrait;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
        $this->userLocation();
        $this->_enVal();
    }
}
