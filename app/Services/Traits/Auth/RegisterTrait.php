<?php

namespace App\Services\Traits\Auth;

use App\ActivationCode;
use App\Events\UserCreated;
use App\Rules\Phone;
use App\Services\Conf\WebConf;
use App\Services\Traits\MyVariables;
use App\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

trait RegisterTrait
{

    use RegistersUsers, MyVariables;
    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'fullname' => ['required', 'string', 'max:255'],
            'phone' => ['required', new Phone],
            'username' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        // $token = Str::random(60);
        return User::create([
            'fullname' => $data['fullname'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'gender' => $data['gender'],
            'username' => $data['username'],
            'password' => Hash::make($data['password']),
            'country' => $this->my_location->getAttribute('country'),
        ]);
    }

    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $this->_enVal();
        $this->_validator = $this->validator($request->all()); //>validate();
        if ($this->_validator->fails()) {
            $this->_setResults('errs', $this->_validator->errors());
            return $this->_showResult();
        }
        $user = $this->create($request->all());
        $v_code = new ActivationCode();
        $v_code->user_id = $user->id;
        $vCode = Str::random(6);
        while (ActivationCode::where('v_code', '=', $vCode)->get()->count()) {
            $vCode = Str::random(6);
        }
        $v_code->v_code = $vCode;
        $v_code->expires_at = Date::now()->addHours(24);
        $v_code->code_type = 'activation';
        $v_code->save();

        // event(new Registered());
        event(new UserCreated($v_code));

        $this->guard()->login($user);

        return $this->registered($request, $user)
            ?: redirect($this->redirectPath());
    }
    /**
     * The user has been registered.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function registered(Request $request, $user)
    {
        $this->_msg = 'Registered successfully :)';
        $this->_type = 'success';
        $this->_success_flag = 1;
        $this->_setResults(WebConf::TOKEN_KEY, $this->guard()->token());
        return $this->_showResult();
    }
}
