<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle HotelsPicture
 * Représente une image associée à un hôtel
 * Le champ position permet le réordonnancement par drag & drop
 */
class HotelsPicture extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id',
        'filepath',   // Chemin relatif depuis storage/app/public/
        'filesize',   // Taille en octets
        'position',   // Index de position pour le tri (commence à 0)
    ];

    /**
     * Relation many-to-one avec Hotel
     * Une image appartient à un seul hôtel
     */
    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
}
