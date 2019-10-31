<?php

namespace App\Services\Traits\Auth;

use App\Rules\AuthUser;
use App\Services\Conf\WebConf;
use App\Services\Traits\MyVariables;
use App\User;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

trait ResetPasswordTrait
{
    use  MyVariables;
    /**
     * Display the password reset view for the given token.
     *
     * If no token is present, display the link request form.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string|null  $token
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function showResetForm(Request $request, $token = null)
    {
        $this->_setResults('token', $token);
        $this->_setResults('email', $request->email);
        return $this->_showResult();
    }



    /**
     * Reset the given user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function reset(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [$this->username() => ['required', 'string', new AuthUser],]);
        if ($this->_validator->fails()) {
            $this->getErrs();
            return $this->_showResult();
        }
    }
    /**
     * Get the reset username to be used by the controller.
     *
     * @return string
     */
    public function username()
    {
        return 'username';
    }
}
