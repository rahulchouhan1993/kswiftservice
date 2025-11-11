<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class ClearCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:clear-custom';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear application cache every 10 minutes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Clear cache
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');

        $this->info('Cache cleared successfully!');
    }
}
