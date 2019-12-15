<?php

namespace App;

use App\Services\Traits\Relations\PhoneBookTrait;
use App\Services\Traits\Relations\SharableSms;
use App\Services\Traits\Relations\Smsable;
use App\Services\Traits\Relations\SmsPayTrait;
use App\Services\Traits\Relations\WebApi\HasWebApps;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable, Smsable, SharableSms, SmsPayTrait, PhoneBookTrait, HasWebApps;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'fullname', 'email', 'password', 'username', 'gender', 'phone', 'country'
    ];
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
    protected $append = ['has_sms'];
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'last_seen' => 'datetime',
        'has_sms' => 'boolean'
    ];
    public function admin()
    {
        return $this->hasOne(Admin::class);
    }
    public function avatar()
    {
        return $this->morphOne(Image::class, 'imageable');
    }
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
    public function clients()
    {
        return $this->hasMany(OnlineClient::class);
    }
    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    /*
     * Send the email verification notification.
     *
     * @return void
     
    public function sendEmailVerificationNotification()
    {
        $this->notify(new ConfirmRegistration);
    }*/
    public function v_codes()
    {
        return $this->hasMany(ActivationCode::class);
    }
    public function domains()
    {
        return $this->hasMany(UserDomain::class);
    }

    public function delete()
    {
        $this->loadMissing(['domains', 'v_codes', 'attachments', 'clients', 'admin', 'messages', 'avatar', 'phonebooks']);
        $this->deleteDomains($this->domains)
            ->deletePhoneBooks($this->phonebooks)
            ->deleteVCodes($this->v_codes);
        parent::delete();
    }
    private function deleteDomains(array $domains)
    {
        if (count($domains) > 0) {
            foreach ($domains as $dmn) {
                $dmn->delete();
            }
        }
        return $this;
    }
    private function deletePhoneBooks(array $phoneBooks)
    {
        if (count($phoneBooks) > 0) {
            foreach ($phoneBooks as $phonebook) {
                $phonebook->delete();
            }
        }
        return $this;
    }
    private function deleteVCodes(array $vCodes)
    {
        if (count($vCodes) > 0) {
            foreach ($vCodes as $vCode) {
                $vCode->delete();
            }
        }
        return $this;
    }
}
