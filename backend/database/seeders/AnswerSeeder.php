<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Audit;
use App\Models\Answer;
use App\Models\User;

class AnswerSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer tous les audits avec leurs questions
        $audits = Audit::with('questions')->get();

        // Récupérer tous les customers
        $customers = User::where('role', 'customer')->get();

        foreach ($audits as $audit) {
            foreach ($audit->questions as $question) {

                // Customer aléatoire
                $customer = $customers->random();

                // Réponse aléatoire (Oui / Non / N/A)
                $choice = collect(['Oui', 'Non', 'N/A'])->random();

                // Justification aléatoire
                $justification = match ($choice) {
                    'Oui' => 'Conforme selon les procédures.',
                    'Non' => 'Non conforme, action corrective requise.',
                    default => 'Non applicable à cette activité.',
                };

                // Créer la réponse
                Answer::create([
                    'audit_id'       => $audit->id,
                    'question_id'    => $question->id,
                    'customer_id'    => $customer->id, 
                    'choice'         => $choice,
                    'justification'  => $justification,
                ]);
            }
        }
    }
}
