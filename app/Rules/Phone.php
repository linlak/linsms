<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Services\Traits\LinValidators;
use phpDocumentor\Reflection\Types\Boolean;

class Phone implements Rule
{
    use LinValidators;
    private $required = false;
    /**
     * Create a new rule instance.
     *@param boolean $required
     * @return void
     */
    public function __construct($required = true)
    {
        //
        $this->required = $required;
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
        if (is_null($value)) {
            if (!$this->required) {
                return true;
            }
        }
        return $this->valphone($value);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.phone');
    }
}
