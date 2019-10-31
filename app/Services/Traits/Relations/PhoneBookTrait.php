<?php

namespace App\Services\Traits\Relations;

use App\Phonebook;

trait PhoneBookTrait
{
    public function phonebooks()
    {
        return $this->hasMany(Phonebook::class);
    }
}
