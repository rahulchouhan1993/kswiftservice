<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        $this->call([
            SuperAdminSeeder::class,
            CountrySeeder::class,
            StateSeeder::class,
            CitySeeder::class,
            DefaultSystemSettings::class,
            VehicleMakesSeeder::class,
            ServiceTypesSeeder::class
        ]);
    }
}
