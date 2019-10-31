<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Traits\LinConsole;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class AdminToken extends Command
{
    use LinConsole;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lin:admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates rights password';

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
        $path = $this->envPath();
        if (Str::contains(file_get_contents($path), 'LIN_ADMIN_TOKEN') === false) {
            $pass = $this->ask("Enter Admin password:", '');
            $this->writekey($path, 'LIN_ADMIN_TOKEN', Hash::make($pass));
        } else {
            if ($this->confirm('Do you want to overight token?')) {
                $pass = $this->ask("Enter Admin password:", '');
                $this->overwritekey($path, 'LIN_ADMIN_TOKEN', Hash::make($pass), 'admin_token');
            }
        }
    }
}
