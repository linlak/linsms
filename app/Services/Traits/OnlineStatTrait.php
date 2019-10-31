<?php

namespace App\Services\Traits;

use App\OnlineClient;
use Illuminate\Http\Request;

trait OnlineStatTrait
{
    public function logOnline(Request $request)
    {


        $onlineClient = OnlineClient::findOrNew(geoip()->getClientIP(), 'client_ip');
        // ->toSql();
        //->get()->first(); //'', 
        $onlineClient->last_seen = \now();
        if (!\is_null(auth()->check())) {
            $onlineClient->user_id = \auth()->id();
        } else {
            $onlineClient->user_id = NULL;
        }
        if (!$onlineClient->exists) {
            $onlineClient->client_ip = geoip()->getClientIP();
        }
        $onlineClient->save();
    }
}
