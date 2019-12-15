<?php

namespace App\Services\Traits\WebApi;

use App\Services\LogsApp;
use Illuminate\Support\Facades\Auth;

trait GuardTrait
{
    use LogsApp;
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
