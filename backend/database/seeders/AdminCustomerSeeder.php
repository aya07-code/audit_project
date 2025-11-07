<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class AdminCustomerSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $customers = User::where('role', 'customer')->get();

        foreach ($customers as $customer) {
            \DB::table('admin_customer')->insert([
                'admin_id' => $admin->id,
                'customer_id' => $customer->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
