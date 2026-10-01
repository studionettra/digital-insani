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
        Schema::table('products', function (Blueprint $table) {
            $table->string('preview_pdf')->nullable()->after('demo_url');
            $table->text('code_snippet')->nullable()->after('preview_pdf');
            $table->string('code_snippet_lang')->nullable()->default('php')->after('code_snippet');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['preview_pdf', 'code_snippet', 'code_snippet_lang']);
        });
    }
};
