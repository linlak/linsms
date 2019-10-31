<?php

namespace App;

use App\Services\Traits\Relations\UserTrait;
use App\WebApi\WebApp;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Model;

class UserDomain extends Model
{
    use UserTrait, Cachable;
    //
    protected $fillable = [
        'user_id',
        'host_scheme',
        'host_name',
        'd_token'
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_subdomain' => 'boolean',
    ];
    public function web_app()
    {
        return $this->hasOne(WebApp::class, 'app_host', 'id');
    }
    public function delete()
    {
        $this->loadMissing('web_app');
        if (!is_null($this->web_app)) {
            $web_app = $this->web_app;
            $web_app->app_host = null;
            $web_app->save();
        }
        return  parent::delete();
    }
}
