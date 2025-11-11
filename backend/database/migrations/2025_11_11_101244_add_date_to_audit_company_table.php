<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('audit_company', function (Blueprint $table) {
            $table->date('date')->nullable()->after('audit_id'); 
            // after('audit_id') juste pour positionner la colonne, nullable pour ma t2atish data actuelle
        });
    }

    public function down()
    {
        Schema::table('audit_company', function (Blueprint $table) {
            $table->dropColumn('date');
        });
    }

};
