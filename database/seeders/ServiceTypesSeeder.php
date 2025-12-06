<?php

namespace Database\Seeders;

use App\Models\ServiceType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            ["engine oil change", "bike", 650],
            ["oil filter replacement", "car", 820],
            ["air filter replacement", "bike", 300],
            ["fuel filter replacement", "car", 910],
            ["spark plug replacement", "bike", 260],
            ["chain replacement", "bike", 750],
            ["engine tuning", "car", 1400],
            ["compression testing", "bike", 500],
            ["coolant flush and refill", "car", 1200],
            ["manual transmission fluid change", "car", 1450],
            ["automatic transmission service", "car", 2200],
            ["clutch inspection and replacement", "bike", 950],
            ["differential oil replacement", "car", 1600],
            ["cv joint inspection", "car", 780],
            ["brake pad replacement", "bike", 550],
            ["rotor resurfacing or replacement", "car", 1700],
            ["brake fluid flush", "bike", 400],
            ["abs diagnostics and service", "car", 1300],
            ["brake line inspection", "bike", 320],
            ["strut replacement", "car", 2000],
            ["suspension bush replacement", "bike", 600],
            ["wheel alignment", "car", 900],
            ["power steering fluid change", "car", 1100],
            ["ball joint and tie rod inspection", "bike", 450],
            ["battery test and replacement", "car", 1800],
            ["alternator check", "car", 950],
            ["starter motor check", "bike", 480],
            ["fuse and wiring inspection", "car", 700],
            ["tail light replacement", "bike", 220],
            ["ac gas refill", "car", 1500],
            ["ac filter replacement", "car", 650],
            ["ac compressor check", "car", 1300],
            ["leak detection and repair", "car", 2000],
            ["ac disinfectant cleaning", "car", 350],
        ];

        foreach ($services as $service) {
            ServiceType::create([
                'name' => ucwords($service[0]),
                'vehicle_type' => $service[1],
                'base_price' => $service[2],
            ]);
        }
    }
}
