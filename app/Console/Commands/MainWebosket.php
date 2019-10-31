<?php

namespace App\Console\Commands;

use App\WesocketApp;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MainWebosket extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'linsms:default_websocket';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'registers default websocket app';

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
        if (WesocketApp::all()->count() > 0) {
            $this->info('alread set');
            return;
        }
        $websocketApp = new WesocketApp();
        $websocketApp->app_key = 'zetU0rnPeh1VrMoJ'; //Str::random();
        $websocketApp->app_secret = 'f9YWt2M4emEvkRvpIrJdVPse7Q0dk4uH'; //Str::random(32);
        $websocketApp->app_name = \config('app.name');
        //  $websocketApp->app_host=
        $websocketApp->is_editable = false;
        $websocketApp->save();
        $this->info('created app successfully :)');
    }
}
