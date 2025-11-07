<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Audit;
use App\Models\Company;
use App\Models\Activity;
use Illuminate\Support\Arr;

class AuditSeeder extends Seeder
{
    public function run(): void
    {
        $auditsList = [
            'ISO 9001 - Management de la qualité',
            'ISO 14001 - Management environnemental',
            'ISO 45001 - Santé & sécurité au travail',
            'ISO 50001 - Management de l’énergie',
            'SMETA - Audit éthique et social',
            'BSCI - Audit social',
            'WRAP - Textile / confection',
            'SA 8000 - Responsabilité sociale',
            'REACH / RoHS - Conformité chimique',
            'HACCP / ISO 22000 - Sécurité alimentaire',
        ];

        // Créer les audits
        $audits = collect();
        foreach ($auditsList as $title) {
            $audits->push(Audit::create([
                'title' => $title,
                'description' => 'Description standard de ' . $title,
                'date' => now(),
                'score' => rand(60, 100),
            ]));
        }

        //  Relier chaque Activity à 3 ou 4 audits aléatoires 
        $activities = Activity::all();
        foreach ($activities as $activity) {
            $randomAudits = $audits->random(rand(3, 4))->pluck('id')->toArray();
            $activity->audits()->sync($randomAudits); // relation many-to-many via activity_audit
        }

        //  Relier chaque Company à 3 audits aléatoires 
        $companies = Company::all();
        foreach ($companies as $company) {
            $randomAudits = $audits->random(3)->pluck('id')->toArray();
            $company->audits()->sync($randomAudits); // relation many-to-many via audit_company
        }
    }
}
