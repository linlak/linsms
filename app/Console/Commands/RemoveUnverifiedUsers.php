<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\SmsPayment;
use Carbon\Carbon;

class RemoveUnverifiedUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:remove-unverified';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Removes users that have no verified emails after 30 days';

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
    }
}
