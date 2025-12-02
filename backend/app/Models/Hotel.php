<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\HotelsPicture;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address1',
        'address2',
        'zipcode',
        'city',
        'country',
        'lat',
        'lng',
        'description',
        'max_capacity',
        'price_per_night',
    ];
    

    public function pictures()
    {
        return $this->hasMany(HotelsPicture::class);
    }

    public function scopeFilter($query, $filters)
    {
        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (!empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        if (!empty($filters['sort'])) {
            $order = $filters['order'] ?? 'asc';
            $query->orderBy($filters['sort'], $order);
        }

        return $query;
    }
}
