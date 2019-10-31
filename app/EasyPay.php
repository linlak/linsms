<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EasyPay extends Model
{
    //
    protected $fillable = [
        'easable_id',
        'easable_type',
        'amount',
        'phone',
        'reason',
        'transactionId',
        'verified'
    ];
    protected $casts = [
        'verified' => 'boolean'
    ];
    public function easable()
    {
        return $this->morphTo();
    }
}
