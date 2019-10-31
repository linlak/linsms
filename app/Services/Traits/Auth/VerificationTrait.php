<?php

namespace App\Services\Traits\Auth;

use App\ActivationCode;
use App\Notifications\AcountActivated;
use App\Services\Conf\WebConf;
use App\Services\Traits\MyVariables;
use Illuminate\Foundation\Auth\VerifiesEmails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;

trait VerificationTrait
{
    use VerifiesEmails, MyVariables;
    protected $toState = ['to' => 'success.activation', 'params' => []];
    private function isValidCode(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [
            'v_code' => 'required|string|exists:activation_codes,v_code'
        ], [], [
            'v_code' => 'verification code'
        ]);
        if ($this->_validator->fails()) {
            $this->getErrs();
            return \false;
        }
        return true;
    }

    public function verCode(Request $request)
    {
        if ($this->isValidCode($request)) {
            $aCode = ActivationCode::with('user')->where('v_code', $request->input('v_code'))->get()->first();
            $this->performVerify($aCode);
        }
        return $this->_showResult();
    }

    private function performVerify(ActivationCode $aCode)
    {
        switch ($aCode->code_type) {
            case 'activation':
            case 'phone':
                // activate account
                /**
                 * @var \App\User
                 */
                $user = $aCode->user;
                if ($aCode->notification_type === 'email') {
                    $user->markEmailAsVerified();
                } else {
                    if ($aCode->notification_type === 'phone') {
                        $user->phone_verified_at = Date::now();
                    }
                }
                $user->status = '1';
                $user->last_seen = Date::now();
                $user->save();
                $user->notify(new AcountActivated());
                $this->_msg = "Your account has been activated successfully :)";
                $this->_success_flag = 1;
                $this->_type = 'success';
                //login user is not logged in or is not equal to loggin user
                if ($this->guard()->check()) {
                    if (!$user->is($this->guard()->user())) {
                        //logout and login new user
                        $this->guard()->logout();
                        $this->guard()->login($user);
                        $this->_setResults(WebConf::TOKEN_KEY, $this->guard()->token());
                    }
                } else {
                    $this->guard()->login($user);
                    $this->_setResults(WebConf::TOKEN_KEY, $this->guard()->token());
                }
                //send notification
                $aCode->delete();

                $this->_setResults('toState', $this->toState);
                break;
            case 'password':
                $this->_msg = 'This is a one time script to help you reset your password';
                $this->_type = 'info';
                break;
            default:
                $this->_msg = "Invalid verification code";
                // $aCode->delete();
                break;
        }
    }
    protected function guard()
    {
        return Auth::guard();
    }
}
