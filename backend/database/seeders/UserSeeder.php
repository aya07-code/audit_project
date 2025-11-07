<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
         $villes = ['tanger', 'casablanca', 'rabat', 'marrakech', 'agadir'];
        // 1 Admin
        $admin = User::create([
            'name' => 'Admin Principal',
            'email' => 'admin@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone' => '0600000000',
            'adress' => 'mocador center',
            'ville' => 'tanger',
            'is_active' => true,
        ]);

        // 20 Customers liés à cet admin
        for ($i = 1; $i <= 20; $i++) {
            $ville = $villes[array_rand($villes)];
            User::create([
                'name' => 'Customer '.$i,
                'email' => 'customer'.$i.'@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password124'),
                'role' => 'customer',
                'phone' => '06'.str_pad($i, 8, '0', STR_PAD_LEFT),
                'adress' => 'rue '.$i,
                'ville' => $ville,
                'is_active' => true,
                'admin_id' => $admin->id,
            ]);
        }
    }
}
