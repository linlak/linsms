<?php

namespace App\Observers;

use App\SmsPayment;
use App\Notifications\NewSmsPay;
use Illuminate\Support\Carbon;
use App\Notifications\VoucherLoaded;
use App\Notifications\Me2UPay;

class SmsPaymentObserver
{
    /**
     * Handle the sms payment "created" event.
     *
     * @param  \App\SmsPayment  $smsPayment
     * @return void
     */
    public function created(SmsPayment $smsPayment)
    {
        if (!$smsPayment->is_m2u) {
            $smsPayment->user->notify((new NewSmsPay($smsPayment))->delay(Carbon::now()->addMinutes(1)));
        } else {
            $smsPayment->received->sender->notify((new VoucherLoaded($smsPayment->received))->delay(\now()->addSeconds(20)));

            $smsPayment->user->notify((new Me2UPay($smsPayment))->delay(\now()->addSeconds(15)));
        }
    }

    /**
     * Handle the sms payment "updated" event.
     *
     * @param  \App\SmsPayment  $smsPayment
     * @return void
     */
    public function updated(SmsPayment $smsPayment)
    {
        // $smsPayment->
    }

    /**
     * Handle the sms payment "deleted" event.
     *
     * @param  \App\SmsPayment  $smsPayment
     * @return void
     */
    public function deleted(SmsPayment $smsPayment)
    {
        //
    }

    /**
     * Handle the sms payment "restored" event.
     *
     * @param  \App\SmsPayment  $smsPayment
     * @return void
     */
    public function restored(SmsPayment $smsPayment)
    {
        //
    }

    /**
     * Handle the sms payment "force deleted" event.
     *
     * @param  \App\SmsPayment  $smsPayment
     * @return void
     */
    public function forceDeleted(SmsPayment $smsPayment)
    {
        //
    }
}
