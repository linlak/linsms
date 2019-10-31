<?php
namespace App\Services\Traits;

trait LinValidators
{
    use LinHelpers;
    public function valphone($string)
    {
        $string = filter_var($string, FILTER_SANITIZE_NUMBER_INT);
        $string = $this->rep_text('-', '', $string);
        if (preg_match('/^[+]?([\d]{0,3})?[\(\.\-\s]?([\d]{3})[\)\.\-\s]*([\d]{3})[\.\-\s]?([\d]{4})$/', $string)) {
            return TRUE;
        } else {
            return FALSE;
        }
    }
    public function alphametric($value)
    {
        if (preg_match("/^[a-zA-Z0-9_\,\'\"\.\?\/\!\-\@\:\(\)\&\;\%\\r\\n\\t ]*$/", $value)) {
            return true;
        }
        return false;
    }
    public function val_email($email)
    {
        $safe_email = filter_var($email, FILTER_SANITIZE_EMAIL);
        $safe_email = filter_var($safe_email, FILTER_VALIDATE_EMAIL);
        if ($safe_email) {
            return true;
        } else {
            return false;
        }
    }
}
