<?php

namespace App\WebApi;

use Illuminate\Database\Eloquent\Model;
use App\Services\Traits\Relations\UserTrait;
use App\Services\Traits\EncryptableTrait;
use App\UserDomain;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;

class WebApp extends Model
{
    use UserTrait, EncryptableTrait, Cachable;

    protected $fillable = ['user_id', 'app_name', 'client_id', 'secret', 'app_host'];
    protected $encryptable = ['secret'];
    protected $casts = ['is_active' => 'boolean', 'is_live' => 'boolean', 'has_domain' => 'boolean'];
    protected $touches = ['app_domain'];
    protected $appended = ['has_domain'];

    public function sms()
    {
        return $this->hasMany(WebAppSms::class, 'app_id');
    }

    public function stats()
    {
        return $this->hasMany(WebAppStat::class, 'app_id');
    }
    public function web_conf()
    {
        return $this->hasOne(WebAppConfig::class, 'app_id');
    }
    public function app_domain()
    {
        return $this->belongsTo(UserDomain::class, 'app_host', 'id');
    }
    public function getHasDomainAttribute()
    {
        $this->loadMissing('app_domain');
        return !is_null($this->app_domain);
    }
}
