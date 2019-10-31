<?php

namespace App\Services\Traits\Auth;

use App\ActivationCode;
use App\Notifications\ResetPassword;
use App\Rules\AuthUser;
use App\Services\Conf\WebConf;
use App\Services\Traits\MyVariables;
use App\User;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

trait ForgotPasswordTrait
{
    use  MyVariables;
    /**
     * Get the needed authentication credentials from the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    protected function credentials(Request $request)
    {
        return [WebConf::getTableClm($request->input('username')) => $request->input('username')];
    }
    /**
     * Validate the email for the given request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    protected function validateEmail(Request $request)
    {
        $this->_validator = Validator::make($request->all(), ['username' => ['required', new AuthUser]]);
    }

    /**
     * Send a reset link to the given user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function sendResetLinkEmail(Request $request)
    {
        $this->validateEmail($request);

        if ($this->_validator->fails()) {
            $this->getErrs();
            return $this->_showResult();
        }
        $user = User::where(WebConf::getTableClm($request->input($this->username())), $request->input($this->username()))->get()->first();
        if (!is_null($user)) {
            $this->perform_recover($user);
        } else {
            $this->_msg = trans('auth.failed');
        }

        return $this->_showResult();
    }

    public function username()
    {
        return 'username';
    }

    private function perform_recover(User $user)
    {
        if ($user->status === '2') {
            $this->_msg = 'This account is not Accessible';
            return;
        }
        $actCode = ActivationCode::where('code_type', 'password')->where('user_id', $user->id)->get()->first();
        if (is_null($actCode)) {
            $actCode = new ActivationCode();
            $actCode->user_id = $user->id;
            $actCode->code_type = 'password';
            $actCode->notification_type = 'email';
            $vCode = Str::random(6);
            $actCode->v_code = $vCode;
        }
        $actCode->expires_at = (Date::now())->addHours(24);
        $actCode->save();
        //send email
        $user->notify(new ResetPassword($actCode));
        $this->_msg = 'A reset code has been sent to your email';
        $this->_type = 'success';
        $this->_success_flag = 1;
    }
}
