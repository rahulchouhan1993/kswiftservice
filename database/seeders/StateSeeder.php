<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Country;
use App\Models\State;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $json = file_get_contents(public_path('indian_cities.json'));
        $citiesArr = json_decode($json, true);

        $country = Country::firstWhere('name', 'India');
        if (!$country) {
            $this->command->error('India not found in countries table.');
            return;
        }

        // Extract unique states
        $states = collect($citiesArr)->pluck('state')->unique();
        foreach ($states as $stateName) {
            State::firstOrCreate([
                'country_id' => $country->id,
                'name' => $stateName
            ]);
        }

        $this->command->info('Indian states seeded successfully!');
    }
}
