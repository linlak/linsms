<?php

namespace App\Http\Controllers\WebApi;

use App\Events\WebAppStatDeleted;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Traits\MyVariables;
use App\Services\Traits\WebApi\CreatesDomain;
use App\Services\Traits\WebApi\EditWebApp;
use App\Services\Traits\WebApi\NewWebApp;
use App\Services\Traits\WebApi\RetrievesWebApps;
use App\UserDomain;
use App\WebApi\WebApp;
use App\WebApi\WebAppStat;
use Illuminate\Support\Str;

class WebAppsController extends Controller
{
    use MyVariables, NewWebApp, RetrievesWebApps, EditWebApp, CreatesDomain;
    public function __construct()
    {
        $this->userLocation();
    }
    public function delStats(Request $request)
    {
        $this->_enVal();
        try { //where('app_id', decrypt($request->input('app_id')))->
            $stat = WebAppStat::where('id', $request->input("id"))->get()->first();
            if (!\is_null($stat)) {
                broadcast(new WebAppStatDeleted($stat));
                $stat->delete();
                $this->_msg = "Success";
                $this->_type = "success";
                $this->_success_flag = 1;
            }
        } catch (\Exception $e) {
            $this->_setResults("error", $e->getMessage());
        }
        return $this->_showResult();
    }
    private function parseStats(WebApp $webApp, $id)
    {
        $stats = [];
        foreach ($webApp->stats as $stat) {
            $stats[] = [
                "id" => $stat->id,
                "message" => $stat->message,
                "status" => ($stat->status == "error") ? "danger" : $stat->status
            ];
        }
        $web_app = [
            'app_name' => $webApp->app_name,
            'stats' => $stats,
            'id' => $id,
            'ws_id' => $webApp->id
        ];
        $this->_setResults("web_app", $web_app);
    }
    public function appStats(Request $request, $id)
    {

        try {
            $web_app = WebApp::with(["stats" => function ($query) {
                $query->latest();
            }])->findOrFail(decrypt($id));
            $this->parseStats($web_app, $id);
        } catch (\Exception $e) {
            $this->_setResults('error', $e->getMessage());
            $this->no_data("App not found");
        }
        return $this->_showResult();
    }
    public function appMessages(Request $request, $id)
    {
        try {
            $web_app = WebApp::with(['sms' => function ($query) {
                $query->latest();
            }])->find(decrypt($id));
            $this->perseAppSms($web_app, $id);
        } catch (\Exception $e) {
            $this->_setResults('error', $e->getMessage());
            $this->no_data("App not found");
        }

        return $this->_showResult();
    }

    private function perseAppSms(WebApp $webApp, $id)
    {
        $sms = [];
        foreach ($webApp->sms as $msg) {
            $sms[] = [
                "id" => $msg->id,
                "sent_sms" => $msg->sent_sms,
                "failed_sms" => $msg->failed_sms,
                "sms_len" => Str::length($msg->message),
                "sender_id" => $msg->sender_id,
            ];
        }
        $web_app = [
            "id" => $id,
            "ws_id" => $webApp->id,
            "sms" => $sms
        ];
        $this->_setResults('web_app', $web_app);
    }
    public function appMessage(Request $request, $id)
    {
        // $webApp=WebApp::with()
        return $this->_showResult();
    }
}
