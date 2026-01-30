<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('questions')->cascadeOnDelete();
            $table->foreignId('audit_id')->constrained('audits')->cascadeOnDelete(); 
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete(); 
            $table->enum('choice', ['Yes', 'No', 'In Progress', 'N/A'])->nullable(); 
            $table->text('reponse')->nullable();
            $table->text('date')->nullable();
            $table->string('certificate_organisme')->nullable();       
            $table->string('certificate_customers_count')->nullable();
            $table->string('attachment')->nullable();
            $table->string('attachment_admin')->nullable();
            $table->text('comment_admin')->nullable();
            $table->enum('validation_status', ['accurate', 'inaccurate'])->default('accurate'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('answers');
    }
};
