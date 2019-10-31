<?php

namespace App\Services\Traits;

use Illuminate\Support\Facades\Crypt;

trait EncryptableTrait
{
    public function getAttribute($key)
    {
        $value = parent::getAttribute($key);

        if (\in_array($key, $this->encryptable) && (!\is_null($value))) {
            $value = Crypt::decrypt($value);
        }
        return $value;
    }

    public function setAttribute($key, $value)
    {
        if (\in_array($key, $this->encryptable) && (!\is_null($value))) {
            $value = Crypt::encrypt($value);
        }
        return parent::setAttribute($key, $value);
    }
}
