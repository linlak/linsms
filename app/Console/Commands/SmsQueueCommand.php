<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\QueuedSms;
use Illuminate\Support\Facades\Date;
use App\Jobs\DeferedSms;

class SmsQueueCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lin:sms_queue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'adds scheduled sms to queue';

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
        $this->info('checking queued sms');
        $queuedSms = QueuedSms::with('user')->where('is_queued', '=', 0)->where('schedule_time', '<=', Date::now())->where("tries", '<', '3')->where('failed', '=', 0)->get();
        if ($queuedSms->count() > 0) {
            foreach ($queuedSms as $sms) {
                $sms->is_queued = true;
                $sms->save();
                $sms->refresh();
                dispatch(new DeferedSms($sms));
            }
        }
        $this->info("queue finished at " . Carbon::now()->toDateTimeString());
    }
}
