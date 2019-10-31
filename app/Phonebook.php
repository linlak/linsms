<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Services\Traits\EncryptableTrait;
use App\Services\Traits\Relations\UserTrait;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;

class Phonebook extends Model
{
    use EncryptableTrait, UserTrait, Cachable;
    protected $encryptable = ['contacts'];
    protected $fillable = ['title', 'user_id', 'contacts'];
}
