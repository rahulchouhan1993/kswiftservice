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
            'engine oil change',
            'oil filter replacement',
            'air filter replacement',
            'fuel filter replacement',
            'spark plug replacement',
            'chain replacement',
            'engine tuning',
            'compression testing',
            'coolant flush and refill',
            'manual transmission fluid change',
            'automatic transmission service',
            'clutch inspection and replacement',
            'differential oil replacement',
            'cv joint inspection',
            'brake pad replacement',
            'rotor resurfacing or replacement',
            'brake fluid flush',
            'abs diagnostics and service',
            'brake line inspection',
            'strut replacement',
            'suspension bush replacement',
            'wheel alignment',
            'power steering fluid change',
            'ball joint and tie rod inspection',
            'battery test and replacement',
            'alternator check',
            'starter motor check',
            'fuse and wiring inspection',
            'tail light replacement',
            'ac gas refill',
            'ac filter replacement',
            'ac compressor check',
            'leak detection and repair',
            'ac disinfectant cleaning',
        ];


        foreach ($services as $service) {
            ServiceType::create([
                'name' => $service
            ]);
        }
    }
}
