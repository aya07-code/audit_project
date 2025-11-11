<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('text');
            $table->string('type')->default('info'); // 'audit_completed', 'admin_reply', etc.
            $table->boolean('is_read')->default(false);
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // destinataire de la notif
            $table->foreignId('audit_id')->nullable()->constrained()->onDelete('cascade'); // optionnel
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
