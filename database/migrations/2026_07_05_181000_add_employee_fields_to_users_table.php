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
            $table->string('document_type')->nullable()->after('email');
            $table->string('identification')->nullable()->after('document_type');
            $table->string('position')->nullable()->after('identification');
            $table->string('department')->nullable()->after('position');
            $table->string('contract_type')->nullable()->after('department');
            $table->decimal('base_salary', 15, 2)->default(0)->after('contract_type');
            $table->decimal('monthly_bonuses', 15, 2)->default(0)->after('base_salary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'document_type',
                'identification',
                'position',
                'department',
                'contract_type',
                'base_salary',
                'monthly_bonuses',
            ]);
        });
    }
};
