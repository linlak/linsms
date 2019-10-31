<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Services\Traits\Easy\PayEasyTrait;
use App\EasyPay;

class PayEasyJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, PayEasyTrait;
    public $tries = 1;
    public $timeout = 1000;
    public $deleteWhenMissingModels = true;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    protected $easyPay;
    public function __construct(EasyPay $easyPay)
    {
        $this->easyPay = $easyPay;
        //
        $this->delay(5);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if (!$this->easyPay->verified) {
            if ($result = $this->requestPayment($this->easyPay->id, $this->easyPay->amount, $this->easyPay->phone, $this->easyPay->reason)) {
                if ($result['success'] === 1) { }
            }
        }
    }
}
