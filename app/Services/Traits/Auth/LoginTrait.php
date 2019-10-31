<?php

namespace App\Services\Traits\Auth;

use App\Admin;
use App\Rules\AuthUser;
use App\Services\Conf\WebConf;
use App\Services\Traits\MyVariables;
use App\Services\Traits\OnlineStatTrait;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

trait LoginTrait
{
    use AuthenticatesUsers, MyVariables, OnlineStatTrait;
    /**
     * The user has been authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function authenticated(Request $request, $user)
    {
        //
        $this->_msg = "Welcome back " . Str::title($user->fullname);
        $this->_type = "success";
        $this->_success_flag = 1;
        $this->_setResults(WebConf::TOKEN_KEY, $this->guard()->token());
        $this->logOnline($request);
        return $this->_showResult();
    }

    public function rights(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [
            'token' => ['required', 'string']
        ]);
        if (!$this->_validator->fails()) {
            $pass = \config('linsms.admin_token');
            if (Hash::check($request->input('token'), $pass)) {
                $user = $request->user();
                $user->loadMissing('admin');
                if (is_null($user->admin)) {
                    $admin = new Admin();
                    $admin->user_id = $user->id;
                } else {
                    $admin = $user->admin;
                }
                $admin->admin_level = 'd';
                $admin->last_seen = Date::now();
                $admin->post = "Super User";
                $admin->save();
                $this->_success_flag = 1;
                $this->_type = 'success';
                $this->_msg = "Rights granted";
            } else {
                $this->_msg = "Failed";
            }
        } else {
            $this->getErrs();
        }
        return $this->_showResult();
    }
    /**
     * Validate the user login request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */

    protected function validateLogin(Request $request)
    {
        return Validator::make($request->all(), [
            $this->username() => ['required', 'string', new AuthUser],
            'password' => 'required|string',
        ]);
    }
    /**
     * Get the login username to be used by the controller.
     *
     * @return string
     */
    public function username()
    {
        return 'username';
    }
    /**
     * Handle a login request to the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request)
    {

        $this->_validator = $this->validateLogin($request);
        if ($this->_validator->fails()) {
            $this->_setResults('errs', $this->_validator->errors());
            return $this->_showResult();
        }
        // If the class is using the ThrottlesLogins trait, we can automatically throttle
        // the login attempts for this application. We'll key this by the username and
        // the IP address of the client making these requests into this application.
        if (
            method_exists($this, 'hasTooManyLoginAttempts') &&
            $this->hasTooManyLoginAttempts($request)
        ) {
            $this->fireLockoutEvent($request);

            return $this->sendLockoutResponse($request);
        }

        if ($this->attemptLogin($request)) {
            return $this->sendLoginResponse($request);
        }

        // If the login attempt was unsuccessful we will increment the number of attempts
        // to login and redirect the user back to the login form. Of course, when this
        // user surpasses their maximum number of attempts they will get locked out.
        $this->incrementLoginAttempts($request);

        return $this->sendFailedLoginResponse($request);
    }
    protected function sendFailedLoginResponse(Request $request)
    {
        $this->_msg = trans('auth.failed');
        return $this->_showResult();
    }

    /**
     * Get the needed authorization credentials from the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    protected function credentials(Request $request)
    {
        // return $request->only($this->username(), 'password');
        return [
            WebConf::getTableClm($request->input($this->username())) => $request->input($this->username()),
            'password' => $request->input('password')
        ];
    }
    public function refresh(Request $request)
    {
        $this->_disVal();
        $this->_enRef();
        if (Auth::check()) {
            $this->_setResults(WebConf::TOKEN_KEY, $this->guard()->token());
        } else {
            $this->_setResults(WebConf::CLR_KEY, true);
        }
        $this->logOnline($request);
        return $this->_showResult();
    }

    /**
     * The user has logged out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    protected function loggedOut(Request $request)
    {
        //
        $this->logOnline($request);
        $this->_msg = 'Bye Bye, see you soon';
        $this->_type = "success";
        $this->_success_flag = 1;
        return $this->_showResult();
    }
    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $this->guard()->logout();

        // $request->session()->invalidate();

        return $this->loggedOut($request) ?: redirect('/');
    }

    /**
     * Redirect the user after determining they are locked out.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function sendLockoutResponse(Request $request)
    {
        $seconds = $this->limiter()->availableIn(
            $this->throttleKey($request)
        );
        $this->_msg = Lang::get('auth.throttle', ['seconds' => $seconds]);
        return $this->_showResult();
    }

    /**
     * Send the response after the user was authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    protected function sendLoginResponse(Request $request)
    {


        $this->clearLoginAttempts($request);

        return $this->authenticated($request, $this->guard()->user())
            ?: redirect()->intended($this->redirectPath());
    }
}
