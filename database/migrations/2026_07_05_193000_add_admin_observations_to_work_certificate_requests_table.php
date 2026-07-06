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
        Schema::table('work_certificate_requests', function (Blueprint $table) {
            $table->text('admin_observations')->nullable()->after('additional_observations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('work_certificate_requests', function (Blueprint $table) {
            $table->dropColumn('admin_observations');
        });
    }
};
