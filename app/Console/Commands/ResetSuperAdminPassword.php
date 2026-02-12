<?php

namespace App\Console\Commands;

use App\Models\SuperAdmin;
use Illuminate\Console\Command;

class ResetSuperAdminPassword extends Command
{
    protected $signature = 'superadmin:reset-password {email} {password}';

    protected $description = 'Reset or set the password for a Super Admin by email';

    public function handle(): int
    {
        $email = (string) $this->argument('email');
        $password = (string) $this->argument('password');

        /** @var \App\Models\SuperAdmin|null $admin */
        $admin = SuperAdmin::where('email', $email)->first();

        if (!$admin) {
            $this->warn("Super Admin not found with email {$email}. Creating new Super Admin...");
            $admin = new SuperAdmin();
            $admin->name = 'Super Admin';
            $admin->email = $email;
            $admin->phone = $admin->phone ?? '';
            $admin->whatsapp_phone = $admin->whatsapp_phone ?? null;
            $admin->status = 1;
        }

        $admin->password = $password; // Will be hashed via model cast
        $admin->save();

        $this->info("Password updated for Super Admin ({$email}).");
        return self::SUCCESS;
    }
}

