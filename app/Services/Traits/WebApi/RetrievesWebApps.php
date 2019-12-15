<?php

namespace App\Services\Traits\WebApi;

use App\User;
use App\WebApi\WebApp;
use App\WebApi\WebAppConfig;
use Exception;
use Illuminate\Http\Request;

trait RetrievesWebApps
{
    public function myApps(Request $request)
    {
        $output = [];
        $user = User::with('web_apps.web_conf')->find($request->user()->id);
        if ($user->web_apps->count() > 0) {
            foreach ($user->web_apps as $web_app) {
                if (is_null($web_app->web_conf)) {
                    $app_conf = new WebAppConfig();
                    $app_conf->app_id = $web_app->id;
                    $app_conf->save();
                    $web_app->refresh();
                }
                $output[] = [
                    'app_name' => $web_app->app_name,
                    'created_at' => $web_app->created_at->toDayDateTimeString(),
                    'updated_at' => $web_app->updated_at->toDayDateTimeString(),
                    'id' => encrypt($web_app->id),
                    'ws_id' => $web_app->id
                ];
            }
        }
        $this->_setResults('web_apps', $output);
        return $this->_showResult();
    }

    public function appHome(Request $request, $id)
    {
        try {
            $web_app = WebApp::with('web_conf')->where('user_id', '=', $request->user()->id)->find(\decrypt($id));
            if (!\is_null($web_app)) {
                $this->passApp($web_app, $id);
            }
        } catch (Exception $e) { }
        return $this->_showResult();
    }

    private function passApp(WebApp $web_app, $id)
    {
        if (is_null($web_app->web_conf)) {
            $app_conf = new WebAppConfig();
            $app_conf->app_id = $web_app->id;
            $app_conf->save();
            $web_app->refresh();
        }

        $data = [
            'app_name' => $web_app->app_name,
            'created_at' => $web_app->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
            'updated_at' => $web_app->updated_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
            'id' => $id,
            'ws_id' => $web_app->id,
            'c_id' => $web_app->client_id,
            's_key' => $web_app->secret,
            'app_conf' => [
                'sms_enabled' => $web_app->web_conf->sms_enabled,
                'funds_enabled' => $web_app->web_conf->funds_enabled,
                'payout_enabled' => $web_app->web_conf->payout_enabled,
            ],
        ];
        $this->_setResults('web_app', $data);
    }
}
