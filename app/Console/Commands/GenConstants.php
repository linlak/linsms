<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Traits\LinConsole;
use Illuminate\Support\Str;

class GenConstants extends Command
{
    use LinConsole;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lin:init';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate api constants';

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
        $this->runInit();
    }
    private function runInit()
    {
        $path = $this->envPath();
        if (Str::contains(file_get_contents($path), 'MTN_HELP_LINE') === false) {
            $mtn_no = $this->ask("Enter Mtn Helpline:", '');
            $this->writekey($path, 'MTN_HELP_LINE', $mtn_no);
        }
        if (Str::contains(file_get_contents($path), 'AIRTEL_HELP_LINE') === false) {
            $airtel_no = $this->ask("Enter Airtel Helpline:", '');
            $this->writekey($path, 'AIRTEL_HELP_LINE', $airtel_no);
        }
        if (Str::contains(file_get_contents($path), 'AFRICELL_HELP_LINE') === false) {
            $africel_no = $this->ask("Enter Airtel Helpline:", '');
            $this->writekey($path, 'AFRICELL_HELP_LINE', $africel_no);
        }
        if (Str::contains(file_get_contents($path), 'SMART_HELP_LINE') === false) {
            $smart_no = $this->ask("Enter Smart Helpline:", '');
            $this->writekey($path, 'SMART_HELP_LINE', $smart_no);
        }
        if (Str::contains(file_get_contents($path), 'EMAIL_HELP_LINE') === false) {
            $info_email = $this->ask("Enter Email Helpline:", '');
            $this->writekey($path, 'EMAIL_HELP_LINE', $info_email);
        }
        if (Str::contains(file_get_contents($path), 'PAY_MTDS') === false) {
            // $airtel_no = $this->ask("Enter Airtel Helpline:", '');
            $this->writekey($path, 'PAY_MTDS', '"Mobile Money/ Payway/ Bank/ Paypal"');
        }
        if (Str::contains(file_get_contents($path), 'SMS_NAME') === false) {
            $sms_name = $this->ask("Enter SMS Gateway Username:", '');
            $this->writekey($path, 'SMS_NAME', $sms_name);
        }
        if (Str::contains(file_get_contents($path), 'SMS_NAME') === false) {
            $sms_name = $this->ask("Enter SMS Gateway Username:", '');
            $this->writekey($path, 'SMS_NAME', $sms_name);
        }
        if (Str::contains(file_get_contents($path), 'SMS_PAS') === false) {
            $sms_pass = $this->ask("Enter SMS Gateway Password:", '');
            $this->writekey($path, 'SMS_PAS', $sms_pass);
        }
    }
}
