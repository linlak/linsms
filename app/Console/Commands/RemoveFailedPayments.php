<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\SmsPayment;
use Illuminate\Support\Carbon;

class RemoveFailedPayments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payments:clear-failed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clears failed sms payments';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //
        $time = Carbon::now()
            ->subHours(24);
        $payments = SmsPayment::whereNull('verified_at')
            ->where('created_at', '<=', $time)
            ->get();
        if ($payments->count() > 0) {
            foreach ($payments as $payment) {
                $payment->delete();
            }
        }
    }
}
