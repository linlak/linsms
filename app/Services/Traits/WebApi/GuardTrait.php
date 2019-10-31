<?php

namespace App\Services\Traits\WebApi;

use Illuminate\Support\Facades\Auth;

trait GuardTrait
{

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\StatefulGuard
     */
    protected function guard()
    {
        return Auth::guard('webapi');
    }
}
