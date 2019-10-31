<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Services\Traits\LinValidators;

class AuthUser implements Rule
{
    use LinValidators;
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if (!$this->valphone($value) && !$this->val_email($value) && !$this->alphametric($value)) {
            return false;
        }
        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.auth_user');
    }
}
