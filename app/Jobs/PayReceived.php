<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Services\Traits\SendSmsText;

class PayReceived implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, SendSmsText;
    protected $reason;
    protected $tries = 1;
    /**
     * Create a new job instance.
     *
     * @return void
     */

    public function __construct($reason)
    {
        //
        $this->reason = $reason;
        $this->delay(5);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //
        $this->sendSmsText('easypay', 'easypay ' . $this->reason, '256751921465');
    }
}
