<?php

namespace App\Services;

use App\WebApi\WebApp;
use App\WebApi\WebAppStat;

trait LogsApp
{
    protected function app_log(WebApp $webApp, string $msg, $status = "info")
    {
        $stats = new WebAppStat(["message" => $msg, "status" => $status, "app_id" => $webApp->id]);
        $stats->save();
        // $webApp->stats->push([]);
    }
}
