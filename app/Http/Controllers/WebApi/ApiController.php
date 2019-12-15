<?php

namespace App\Http\Controllers\WebApi;

use App\Http\Controllers\Controller;
use App\Services\Traits\WebApi\ApiTrait;

class ApiController extends Controller
{

    use ApiTrait;
    public function __construct()
    {
        $this->is_api = true;
    }
}
