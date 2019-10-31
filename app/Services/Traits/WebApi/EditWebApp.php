<?php

namespace App\Services\Traits\WebApi;

use App\WebApi\WebApp;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

trait EditWebApp
{
    public function appEdit(Request $request, $id)
    {
        $web_app = WebApp::where('user_id', '=', $request->user()->id)->find(\decrypt($id));
        if (!is_null($web_app)) {
            $this->_setResults('web_app', [
                'app_name' => $web_app->app_name,
                'id' => encrypt($web_app->id)
            ]);
        }
        return $this->_showResult();
    }

    public function update(Request $request)
    {
        $this->_enVal();
        if ($this->valApp($request)) {
            try {
                $web_app = WebApp::where('user_id', '=', $request->user()->id)->find(\decrypt($request->input('id')));
                if (!\is_null($web_app)) {

                    $web_app->app_name = $request->input('app_name');

                    if ($request->input('ref_keys') == 1) {
                        $web_app->client_id = Str::random();
                        $web_app->secret = Str::random(32);
                    }
                    $web_app->save();
                    $this->_msg = "App changes saved successfully :)";
                    $this->_type = "success";
                    $this->_success_flag = 1;
                    $this->_setResults('done', true);
                }
            } catch (Exception $e) { }
        }
        return $this->_showResult();
    }
    public function editClientId(Request $request)
    {
        $this->_enVal();
        try {
            $web_app = WebApp::where('user_id', '=', $request->user()->id)->find(\decrypt($request->input('id')));
            if (!\is_null($web_app)) {
                $web_app->client_id = Str::random();
                $web_app->save();
                $web_app->refresh();
                $this->_msg = "ClientID refreshed successfully :)";
                $this->_type = "success";
                $this->_success_flag = 1;
                $this->passApp($web_app, $request->input('id'));
            }
        } catch (Exception $e) { }
        return $this->_showResult();
    }
    public function editSecret(Request $request)
    {
        $this->_enVal();
        try {
            $web_app = WebApp::where('user_id', '=', $request->user()->id)->find(\decrypt($request->input('id')));
            if (!\is_null($web_app)) {
                $web_app->secret = Str::random(32);
                $web_app->save();
                $web_app->refresh();
                $this->_msg = "App secret refreshed successfully :)";
                $this->_type = "success";
                $this->_success_flag = 1;
                $this->passApp($web_app, $request->input('id'));
            }
        } catch (Exception $e) { }
        return $this->_showResult();
    }

    //edit app config

    public function editSmsApi(Request $request)
    {
        $this->_enVal();
        try {
            $web_app = WebApp::with('web_conf')->where('user_id', '=', $request->user()->id)->find(\decrypt($request->input('id')));
            if (!\is_null($web_app)) {
                $web_conf = $web_app->web_conf;
                $web_conf->sms_enabled = !$web_conf->sms_enabled;
                $web_conf->save();
                $web_app->refresh();
                $this->_msg = "SMS Api configured successfully :)";
                $this->_type = "success";
                $this->_success_flag = 1;
                $this->passApp($web_app, $request->input('id'));
            }
        } catch (Exception $e) { }
        return $this->_showResult();
    }
    public function editFundsApi(Request $request)
    {
        $this->_enVal();
        try {
            $web_app = WebApp::with('web_conf')->where('user_id', '=', $request->user()->id)->find(\decrypt($request->input('id')));
            if (!\is_null($web_app)) {

                $web_conf = $web_app->web_conf;
                $web_conf->funds_enabled =  !$web_conf->funds_enabled;
                if (!$web_conf->funds_enabled) {
                    $web_conf->payout_enabled = $web_conf->funds_enabled;
                }
                $web_conf->save();
                $web_app->refresh();

                $this->_msg = "Funds Api configured successfully :)";
                $this->_type = "success";
                $this->_success_flag = 1;
                $this->passApp($web_app, $request->input('id'));
            }
        } catch (Exception $e) { }
        return $this->_showResult();
    }
    public function editPayoutApi(Request $request)
    {
        $this->_enVal();
        try {
            $web_app = WebApp::with('web_conf')->where('user_id', '=', $request->user()->id)->find(\decrypt($request->input('id')));
            if (!\is_null($web_app)) {
                $web_conf = $web_app->web_conf;
                $web_conf->funds_enabled = true;
                $web_conf->payout_enabled = !$web_conf->payout_enabled;
                $web_conf->save();
                $web_app->refresh();

                $this->_msg = "Payout Api configured successfully :)";
                $this->_type = "success";
                $this->_success_flag = 1;
                $this->passApp($web_app, $request->input('id'));
            }
        } catch (Exception $e) { }
        return $this->_showResult();
    }
}
