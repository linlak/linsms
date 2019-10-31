<?php

namespace App\Services;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\Authenticatable;

class AppGuard implements Guard
{
    use GuardHelpers, AuthorizesApp;
    /**
     * @var \App\WebApi\WebApp;
     */
    protected $webApp;
    protected $request;

    public function __construct(UserProvider $provider, Request $request)
    {
        $this->request = $request;
        $this->setProvider($provider);
        $this->user = null;
        // $this->loginUsingId(1);
        // $this->getApp();
    }
    public function web_app()
    {
        return $this->webApp;
    }

    public function user()
    {
        if (is_null($this->user)) {
            $this->getApp();
        }
        if (!is_null($this->user)) {
            return $this->user;
        }
    }


    /**
     * Validate a user's credentials.
     *
     * @param  array  $credentials
     * @return bool
     */
    public function validate(array $credentials = [])
    {

        return false;
    }

    /**
     * Attempt to authenticate a user using the given credentials.
     *
     * @param  array  $credentials
     * @param  bool   $remember
     * @return bool
     */
    public function attempt(array $credentials = [], $remember = false)
    {
        if ($this->validate($credentials)) {

            return true;
        }
        return false;
    }

    /**
     * Log a user into the application without sessions or cookies.
     *
     * @param  array  $credentials
     * @return bool
     */
    public function once(array $credentials = [])
    {
        return $this->validate($credentials);
    }

    /**
     * Log a user into the application.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @param  bool  $remember
     * @return void
     */
    public function login(Authenticatable $user, $remember = false)
    {
        // $this->setUser($user);
    }

    /**
     * Log the given user ID into the application.
     *
     * @param  mixed  $id
     * @param  bool   $remember
     * @return \Illuminate\Contracts\Auth\Authenticatable
     */
    public function loginUsingId($id, $remember = false)
    {

        // $user = $this->provider->retrieveById($id);

        // if (!is_null($user)) {
        //     $this->setUser($user);
        //     return $this->user();
        // }
    }

    /**
     * Log the given user ID into the application without sessions or cookies.
     *
     * @param  mixed  $id
     * @return bool
     */
    public function onceUsingId($id)
    {

        // $user = $this->provider->retrieveById($id);

        // if (!is_null($user)) {
        //     $this->setUser($user);
        //     return true;
        // }
        // return false;
    }

    /**
     * Determine if the user was authenticated via "remember me" cookie.
     *
     * @return bool
     */
    public function viaRemember()
    { }

    /**
     * Log the user out of the application.
     *
     * @return void
     */
    public function logout()
    {

        $this->user = NULL;
    }
}
