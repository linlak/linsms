<?php

namespace App\Services\Traits\WebApi;

use App\WebApi\WebApp;
use App\WebApi\WebAppConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

trait NewWebApp
{
    public function createApp(Request $request)
    {
        $this->_enVal();
        if ($this->valApp($request)) {
            $web_app = new WebApp();
            $web_app->app_name = $request->input('app_name');
            $web_app->user_id = auth()->id();
            $web_app->client_id = Str::random();
            $web_app->secret = Str::random(32);
            $web_app->save();
            $app_conf = new WebAppConfig();
            $app_conf->app_id = $web_app->id;
            $app_conf->save();

            $this->_msg = "App created successfully :)";
            $this->_type = "success";
            $this->_success_flag = 1;
        }
        return $this->_showResult();
    }
    private function valApp(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [
            'app_name' => ['required', 'string'],
        ], [], [
            'app_name' => 'App Name'
        ]);
        if ($this->_validator->fails()) {
            $this->getErrs();
            return false;
        }
        return true;
    }
}
