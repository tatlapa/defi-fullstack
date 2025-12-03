<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Création de la table hotels_pictures
     * Stocke les images associées aux hôtels avec leur position
     */
    public function up(): void
    {
        Schema::create('hotels_pictures', function (Blueprint $table) {
            $table->id();
            // Clé étrangère avec suppression en cascade
            $table->foreignId('hotel_id')->constrained('hotels')->onDelete('cascade');
            $table->string('filepath');        // Chemin relatif depuis storage/app/public/
            $table->unsignedInteger('filesize'); // Taille en octets
            $table->unsignedInteger('position'); // Position pour le tri (drag & drop)
            $table->timestamps();
        });
    }

    /**
     * Annulation de la migration
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels_pictures');
    }
};
