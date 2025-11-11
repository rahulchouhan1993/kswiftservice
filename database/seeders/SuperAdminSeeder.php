<?php

namespace Database\Seeders;

use App\Models\SuperAdmin;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SuperAdmin::create([
            'name' => 'Super Admin',
            'email' => 'admin@gmail.com',
            'phone' => '7733844020',
            'whatsapp_phone' => '7733844020',
            'password' => 'admin@123',
        ]);
    }
}
