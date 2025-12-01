<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelsPicture extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id',
        'filepath',
        'filesize',
        'position',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
}
