<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Activity;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
public function run(): void
    {
        $activities = [
            ['name' => 'Industrie', 'description' => 'Secteur industriel : fabrication, énergie, textile, etc.'],
            ['name' => 'Agriculture & Agroalimentaire', 'description' => 'Production agricole et transformation alimentaire.'],
            ['name' => 'BTP / Construction', 'description' => 'Bâtiments, travaux publics, infrastructures.'],
            ['name' => 'Tourisme & Hôtellerie', 'description' => 'Hôtels, restaurants, agences de voyage.'],
            ['name' => 'Énergie', 'description' => 'Production et gestion énergétique.'],
            ['name' => 'Tertiaire / Services', 'description' => 'Bureaux, services financiers, commerce.'],
        ];

        foreach ($activities as $a) {
            Activity::create($a);
        }
    }
}
