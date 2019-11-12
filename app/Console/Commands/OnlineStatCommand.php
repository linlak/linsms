<?php

namespace App\Console\Commands;

use App\OnlineClient;
use Illuminate\Console\Command;

class OnlineStatCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'linsms:remove-onlinestats';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'removes clients older than 1 minute';

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
        $stats = OnlineClient::where('last_seen', '<=', \now()->subMinute())->get();
        if ($stats->count() > 0) {
            foreach ($stats as $stat) {
                $stat->delete();
            }
        }
    }
}
