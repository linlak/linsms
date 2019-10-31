<?php

namespace App\Services\Traits\WebApi;

use App\User;
use App\UserDomain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

trait CreatesDomain
{
    private function is_valDomain(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [
            'host_scheme' => 'required|string',
            'host_name' => 'required|string',
        ], [], [
            'host_scheme' => 'scheme'
        ]);
        if ($this->_validator->fails()) {
            $this->getErrs();
            return \false;
        }
        return true;
    }

    public function storeDomain(Request $request)
    {
        $this->_enVal();
        if ($this->is_valDomain($request)) {
            //create or edit
            if (is_null($request->input('id'))) {
                $mydomain = new UserDomain($request->only('host_scheme', 'host_name'));
                $mydomain->user_id = \auth()->id();
                $mydomain->d_token = Str::uuid();
                $mydomain->save();
                $this->_success_flag = 1;
                $this->_msg = "Domain added successfully :)";
                $this->_type = "success";
            } else {
                try {
                    $mydomain =  UserDomain::findOrFail(decrypt($request->input('id')));
                    $mydomain->host_scheme = $request->input('host_scheme');
                    $mydomain->host_scheme = $request->input('host_name');
                    $mydomain->is_verified = false;
                    $mydomain->save();
                    $this->_success_flag = 1;
                    $this->_msg = "Domain saved successfully :)";
                    $this->_type = "success";
                } catch (\Throwable $th) {
                    //throw $th;
                }
            }
        }
        return $this->_showResult();
    }
    public function myDomains(Request $request)
    {
        $output = [];
        $user = User::with(['domains' => function ($query) {
            $query->latest();
        }])->find(\auth()->id());
        if (count($user->domains) > 0) {
            $this->_setResults('fd', $user->domains);
            foreach ($user->domains as $mdomain) {
                $mydomain = [
                    'id' => \encrypt($mdomain->id),
                    'host_scheme' => $mdomain->host_scheme,
                    'host_name' => $mdomain->host_name,
                    'is_verified' => $mdomain->is_verified
                ];
                if (!is_null($mdomain->web_app)) {
                    $mydomain['web_app']
                        = [
                            'id' => \encrypt($mdomain->web_app->id),
                            'app_name' => $mdomain->web_app->app_name,
                        ];
                }
                $output[] = $mydomain;
            }
        }
        $this->_setResults('mydomains', $output);
        return $this->_showResult();
    }
    public function destroyDomain(Request $request)
    {
        $this->_enVal();
        try {
            $mdomain = UserDomain::with('web_app')->where('user_id', auth()->id())->find(\decrypt($request->input('id')));
            if (!is_null($mdomain)) {

                $mdomain->delete();
                $this->_success_flag = 1;
                $this->_msg = "Domain deleted successfully :)";
                $this->_type = "success";
            }
        } catch (\Throwable $th) {
            //throw $th;
        }
        return $this->_showResult();
    }
}
