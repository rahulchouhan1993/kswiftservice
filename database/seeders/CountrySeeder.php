<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Http;
use App\Models\Country;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // if(Storage::disk('public')->exists('country_state.json')){
        //     $json = Storage::disk('public')->get('country_state.json');
        //     $cArr = json_decode($json, true);
        //     if(!empty($cArr) and is_array($cArr)){
        //         foreach($cArr as $c){
        //             $country = Country::firstWhere('name', $c['name']);
        //             if(!$country){
        //                 $country = Country::create([
        //                     'name' => $c['name'],
        //                     'iso_2' => $c['countryCode'] ?? NULL,
        //                     'iso_3' => $c['countryCodeAlpha3'] ?? NULL,
        //                     'phone_code' => $c['phone'] ?? NULL,
        //                     'currency' => $c['currency'] ?? NULL,
        //                 ]);


        //                 if(!empty($c['countryCode'])){
        //                 //     $flag = Http::get("https://countryflagsapi.com/svg/{$country->iso_2}");
        //                 //     if($flag->successful()){
        //                 //         $path = "flags/".strtolower($country->iso_2).".svg";
        //                 //         Storage::disk('public')->put($path, $flag->body());
        //                 //         $country->flag = $path;
        //                 //         $country->save();
        //                 //    }
        //                 $country->flag = null;
        //                 $country->save();
        //                }
        //            }
        //        }
        //    }
        // }

        Country::create([
            'name' => 'India',
            'iso_2' => 'IN',
            'iso_3' => 'IND',
            'phone_code' => "91",
            'currency' => 'rupee',
            'flag' => "https://flagcdn.com/in.svg",
        ]);
    }
}
