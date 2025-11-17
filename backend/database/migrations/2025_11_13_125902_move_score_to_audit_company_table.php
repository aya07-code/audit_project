<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Ajouter la colonne score dans audit_company
        Schema::table('audit_company', function (Blueprint $table) {
            $table->float('score')->nullable()->after('company_id');
        });

        // 2. Migrer les données depuis audits vers audit_company
        $audits = DB::table('audits')->get();

        foreach ($audits as $audit) {
            // Si chaque audit est lié à plusieurs companies, adapte cette partie
            DB::table('audit_company')
                ->where('audit_id', $audit->id)
                ->update(['score' => $audit->score]);
        }

        // 3. Supprimer la colonne score de audits
        Schema::table('audits', function (Blueprint $table) {
            $table->dropColumn('score');
        });
    }

    public function down(): void
    {
        // 1. Ajouter à nouveau score dans audits
        Schema::table('audits', function (Blueprint $table) {
            $table->float('score')->nullable()->after('date');
        });

        // 2. Restaurer les données depuis audit_company
        $auditCompanies = DB::table('audit_company')->get();
        foreach ($auditCompanies as $ac) {
            DB::table('audits')
                ->where('id', $ac->audit_id)
                ->update(['score' => $ac->score]);
        }

        // 3. Supprimer la colonne score de audit_company
        Schema::table('audit_company', function (Blueprint $table) {
            $table->dropColumn('score');
        });
    }
};
