<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\State;
use App\Models\City;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $json = file_get_contents(public_path('indian_cities.json'));
        $citiesArr = json_decode($json, true);

        if (!empty($citiesArr) && is_array($citiesArr)) {
            foreach ($citiesArr as $c) {
                $state = State::firstWhere('name', $c['state']);
                if ($state) {
                    City::firstOrCreate([
                        'state_id' => $state->id,
                        'name' => $c['name'],
                    ]);
                }
            }
        }
    }
}
