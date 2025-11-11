<?php

namespace Database\Seeders;

use App\Models\VehicleMake;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehicleMakesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $makes = [
            'abarth',
            'acura',
            'aiways',
            'alfa romeo',
            'alpina',
            'alpine',
            'aston martin',
            'audi',
            'baic',
            'bentley',
            'bmw',
            'bordrin',
            'borgward',
            'bugatti',
            'buick',
            'byd',
            'cadillac',
            'caterham',
            'chery',
            'chevrolet',
            'chrysler',
            'citroën',
            'daihatsu',
            'denza',
            'de tomaso',
            'dodge',
            'dongfeng',
            'faw',
            'ferrari',
            'fiat',
            'fisker',
            'ford',
            'gmc',
            'geely',
            'genesis',
            'great wall motors (gwm)',
            'haval',
            'honda',
            'hongqi',
            'human horizons (hiphi)',
            'hyundai',
            'infiniti',
            'italdesign',
            'jac motors',
            'jaguar',
            'jeep',
            'jetour',
            'kia',
            'koenigsegg',
            'lamborghini',
            'lancia',
            'land rover',
            'leapmotor',
            'lexus',
            'li auto',
            'lincoln',
            'lotus',
            'lucid motors',
            'mahindra',
            'maserati',
            'maybach',
            'mazda',
            'mclaren',
            'mercedes-benz',
            'mg',
            'mini',
            'mitsubishi',
            'mitsuoka',
            'morgan',
            'nio',
            'nissan',
            'opel',
            'ora',
            'pagani',
            'peugeot',
            'porsche',
            'ram',
            'renault',
            'rimac',
            'rivian',
            'rolls-royce',
            'saab',
            'seres',
            'smart',
            'subaru',
            'suzuki',
            'tata',
            'tesla',
            'toyota',
            'tvr',
            'venturi',
            'volkswagen (vw)',
            'volvo',
            'voyah',
            'weltmeister (wm motor)',
            'wiesmann',
            'xpeng',
        ];

        foreach ($makes as $make) {
            VehicleMake::create([
                'name' => $make
            ]);
        }
    }
}
