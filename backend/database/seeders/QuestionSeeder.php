<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Audit;
use App\Models\Question;
use Illuminate\Support\Facades\DB;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        // Tableau : titre d’audit => liste de questions
        $questionsByAudit = [
            'ISO 9001 - Management de la qualité' => [
                'Les procédures qualité sont-elles documentées et tenues à jour ?',
                'Les objectifs qualité sont-ils mesurables et suivis régulièrement ?',
                'Les clients sont-ils satisfaits du produit ou service livré ?',
                'Des actions correctives sont-elles prises en cas de non-conformité ?',
                'Le personnel est-il formé à son poste de travail ?',
                'Les enregistrements qualité sont-ils conservés et accessibles ?',
                'Y a-t-il une revue de direction annuelle du système qualité ?',
                'Les fournisseurs sont-ils évalués périodiquement ?',
                'Les équipements de mesure sont-ils étalonnés ?',
                'Les plaintes clients sont-elles analysées et traitées ?',
            ],
            'ISO 14001 - Management environnemental' => [
                'L’entreprise a-t-elle identifié ses aspects environnementaux significatifs ?',
                'Un plan d’action environnemental est-il mis en œuvre ?',
                'Les déchets sont-ils triés et gérés correctement ?',
                'Les consommations d’eau et d’énergie sont-elles suivies ?',
                'Y a-t-il une veille réglementaire environnementale à jour ?',
                'Le personnel est-il sensibilisé à la protection de l’environnement ?',
                'Des objectifs environnementaux sont-ils définis ?',
                'Les incidents environnementaux sont-ils enregistrés et traités ?',
                'Les produits chimiques sont-ils stockés de manière sécurisée ?',
                'L’entreprise dispose-t-elle d’un plan d’urgence environnemental ?',
            ],
            'ISO 45001 - Santé & sécurité au travail' => [
                'Les risques professionnels sont-ils identifiés et évalués ?',
                'Le personnel reçoit-il une formation sécurité ?',
                'Des EPI (équipements de protection individuelle) sont-ils fournis ?',
                'Les accidents du travail sont-ils enregistrés et analysés ?',
                'Des exercices d’évacuation sont-ils réalisés régulièrement ?',
                'Les postes de travail sont-ils conformes aux règles de sécurité ?',
                'Le comité HSE se réunit-il périodiquement ?',
                'Les premiers secours sont-ils disponibles sur le site ?',
                'Les sous-traitants respectent-ils les consignes de sécurité ?',
                'Des inspections sécurité sont-elles menées régulièrement ?',
            ],
            'ISO 50001 - Management de l’énergie' => [
                'L’entreprise suit-elle sa consommation d’énergie ?',
                'Des objectifs d’efficacité énergétique sont-ils fixés ?',
                'Les équipements énergivores sont-ils identifiés ?',
                'Des actions d’économie d’énergie sont-elles mises en œuvre ?',
                'Les compteurs d’énergie sont-ils régulièrement relevés ?',
                'Le personnel est-il sensibilisé à la gestion énergétique ?',
                'Les sources d’énergie renouvelable sont-elles envisagées ?',
                'Y a-t-il un responsable énergie désigné ?',
                'Les projets d’investissement intègrent-ils un critère énergétique ?',
                'L’entreprise a-t-elle une politique énergétique écrite ?',
            ],
            'SMETA - Audit éthique et social' => [
                'Les travailleurs reçoivent-ils des contrats écrits ?',
                'Le travail des enfants est-il interdit et contrôlé ?',
                'Les heures supplémentaires sont-elles volontaires ?',
                'Les salaires respectent-ils les lois locales ?',
                'Les employés ont-ils accès à des conditions de travail sûres ?',
                'La discrimination est-elle proscrite ?',
                'Le personnel peut-il s’exprimer librement (syndicat, plainte, etc.) ?',
                'Les travailleurs sont-ils traités avec respect ?',
                'Des audits internes sociaux sont-ils réalisés ?',
                'Les données du personnel sont-elles protégées ?',
            ],
            'BSCI - Audit social' => [
                'Les employés sont-ils payés au moins au salaire minimum légal ?',
                'Les horaires de travail sont-ils conformes à la loi ?',
                'L’entreprise interdit-elle le travail forcé ?',
                'Les employés disposent-ils d’un jour de repos hebdomadaire ?',
                'Les lieux de travail sont-ils sûrs et propres ?',
                'Le personnel est-il libre d’adhérer à un syndicat ?',
                'Des mécanismes de plainte confidentiels existent-ils ?',
                'Le travail des enfants est-il interdit ?',
                'L’entreprise respecte-t-elle la non-discrimination ?',
                'Les documents d’identité des employés sont-ils conservés par eux-mêmes ?',
            ],
            'WRAP - Textile / confection' => [
                'Les travailleurs sont-ils payés correctement et à temps ?',
                'Les conditions de travail sont-elles sécurisées ?',
                'Les employés sont-ils majeurs ?',
                'Le temps de travail respecte-t-il la législation ?',
                'Les sorties d’urgence sont-elles dégagées ?',
                'L’usine dispose-t-elle d’autorisations légales de fonctionnement ?',
                'Les produits chimiques sont-ils manipulés correctement ?',
                'Les dossiers du personnel sont-ils complets et à jour ?',
                'Le personnel reçoit-il une formation sur la sécurité ?',
                'Les pratiques de licenciement sont-elles équitables ?',
            ],
            'SA 8000 - Responsabilité sociale' => [
                'Le travail des enfants est-il interdit ?',
                'Le travail forcé est-il prohibé ?',
                'Les conditions de santé et sécurité sont-elles respectées ?',
                'La liberté syndicale est-elle garantie ?',
                'La discrimination est-elle absente dans le recrutement ?',
                'Les horaires de travail respectent-ils les normes légales ?',
                'Les salaires couvrent-ils les besoins de base ?',
                'Les employés sont-ils formés à leurs droits ?',
                'Un responsable RSE est-il désigné ?',
                'Des audits sociaux sont-ils menés régulièrement ?',
            ],
            'REACH / RoHS - Conformité chimique' => [
                'Les substances utilisées sont-elles enregistrées dans REACH ?',
                'Les fournisseurs déclarent-ils la composition chimique des produits ?',
                'Les produits contiennent-ils du plomb, mercure ou cadmium ?',
                'Les fiches de données de sécurité sont-elles disponibles ?',
                'Les employés sont-ils formés à la manipulation des produits chimiques ?',
                'Les produits non conformes sont-ils isolés ?',
                'Y a-t-il un suivi réglementaire sur REACH / RoHS ?',
                'Les équipements électriques respectent-ils RoHS ?',
                'Les déchets dangereux sont-ils éliminés correctement ?',
                'Les analyses chimiques sont-elles archivées ?',
            ],
            'HACCP / ISO 22000 - Sécurité alimentaire' => [
                'Un plan HACCP est-il documenté et mis à jour ?',
                'Les points critiques de contrôle (CCP) sont-ils surveillés ?',
                'Les employés respectent-ils les règles d’hygiène ?',
                'Les matières premières sont-elles contrôlées à la réception ?',
                'Les températures de stockage sont-elles surveillées ?',
                'Les produits non conformes sont-ils isolés ?',
                'Les locaux sont-ils propres et bien entretenus ?',
                'Le personnel reçoit-il une formation en sécurité alimentaire ?',
                'Les fournisseurs sont-ils approuvés ?',
                'Les audits internes HACCP sont-ils réalisés ?',
            ],
        ];

        // Pour chaque audit, on crée les questions et on les lie dans audit_question
        foreach ($questionsByAudit as $auditTitle => $questions) {
            $audit = Audit::where('title', $auditTitle)->first();
            if (!$audit) continue;

            foreach ($questions as $text) {
                $question = Question::create([
                    'text' => $text,
                    'type' => 'boolean', // ou 'text', selon ton schéma
                ]);

                // insérer dans la table pivot audit_question
                DB::table('audit_question')->insert([
                    'audit_id' => $audit->id,
                    'question_id' => $question->id,
                ]);
            }
        }
    }
}
