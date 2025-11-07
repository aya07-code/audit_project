<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Audit;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        // Charger tous les audits avec leurs companies et customers
        $audits = Audit::with('companies.customer')->get();

        $methods = ['Espèces', 'Carte bancaire', 'Virement bancaire'];
        $statuses = ['payé', 'en attente', 'échoué'];

        $count = 0;

        foreach ($audits as $audit) {
            foreach ($audit->companies as $company) {
                $customer = $company->customer;

                // Vérifier que la company a bien un customer lié
                if ($customer) {
                    // Créer 1 à 2 paiements par couple audit/customer
                    for ($i = 0; $i < rand(1, 2); $i++) {
                        Payment::create([
                            'audit_id'  => $audit->id,
                            'client_id' => $customer->id,
                            'amount'    => rand(1000, 10000), // montant réaliste
                            'method'    => $methods[array_rand($methods)],
                            'status'    => $statuses[array_rand($statuses)],
                            'date'      => now()->subDays(rand(1, 60)),
                        ]);
                        $count++;
                    }
                }
            }
        }

        $this->command->info("✅ $count paiements créés avec succès !");
    }
}
