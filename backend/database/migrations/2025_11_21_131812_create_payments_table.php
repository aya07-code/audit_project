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
        Schema::create('payments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
        $table->foreignId('audit_id')->nullable()->constrained('audits')->nullOnDelete();
        $table->decimal('amount', 10, 2);
        $table->string('method');
        $table->enum('status',['pending','paid','sending','validated'])->default('pending');
        $table->date('due_date');
        $table->boolean('is_paid')->default(false);
        $table->string('attachment')->nullable();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
