<?php

namespace App\Http\Controllers\WebApi;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Traits\MyVariables;
use App\Services\Traits\WebApi\CreatesDomain;
use App\Services\Traits\WebApi\EditWebApp;
use App\Services\Traits\WebApi\NewWebApp;
use App\Services\Traits\WebApi\RetrievesWebApps;
use App\UserDomain;

class WebAppsController extends Controller
{
    use MyVariables, NewWebApp, RetrievesWebApps, EditWebApp, CreatesDomain;
    public function __construct()
    {
        $this->userLocation();
    }
    public function appMessages(Request $request, $id)
    {
        return $this->_showResult();
    }
    public function appMessage(Request $request, $id)
    {
        return $this->_showResult();
    }
}
