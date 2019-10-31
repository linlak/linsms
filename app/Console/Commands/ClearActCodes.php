<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\ActivationCode;
use App\Events\ActivationFailed;
use Illuminate\Support\Facades\Date;

class ClearActCodes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lin:clear-activation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes expired ActivationCode';

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
        $this->info("clearing expired activation codes");
        $v_codes = ActivationCode::with('user')->where('expires_at', '<=', Date::now())->get();
        if ($v_codes->count() > 0) {
            foreach ($v_codes as $v_code) {
                if (!is_null($v_code->user)) {
                    \event(new ActivationFailed($v_code->user));
                }
                $v_code->delete();
            }
            $this->info("cleared expired activation codes");
        }
    }
}
