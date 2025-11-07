<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->after('password');
            $table->string('adress')->after('phone');
            $table->string('ville')->after('adress');
            $table->enum('role', ['admin', 'customer'])->default('customer')->after('ville');
            $table->boolean('is_active')->default(true)->after('role');
            $table->unsignedBigInteger('admin_id')->nullable()->after('is_active');
            $table->foreign('admin_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['admin_id']);
            $table->dropColumn(['phone', 'adress', 'ville', 'role', 'is_active', 'admin_id']);
        });
    }
};
