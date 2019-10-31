<?php

namespace App\Console\Commands;

use App\Events\SliderQuote;
use App\Quote;
use Illuminate\Console\Command;

class SliderQuoteCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'linsms:quote-slider';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Selects random quotes for broadcast';

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
        $quote = Quote::inRandomOrder()->get()->first();
        if (!is_null($quote)) {
            broadcast(new SliderQuote($quote));
        }
    }
}
