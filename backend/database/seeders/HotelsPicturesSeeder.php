<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HotelsPicture;

class HotelsPicturesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HotelsPicture::insert([
            // Hotel 1
            [
                'hotel_id' => 1,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 1,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            [
                'hotel_id' => 1,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 2,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            // Hotel 2
            [
                'hotel_id' => 2,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 1,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            [
                'hotel_id' => 2,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 2,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            // Hotel 3
            [
                'hotel_id' => 3,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 1,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            [
                'hotel_id' => 3,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 2,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            // Hotel 4
            [
                'hotel_id' => 4,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 1,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            [
                'hotel_id' => 4,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 2,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            // Hotel 5
            [
                'hotel_id' => 5,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 1,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            [
                'hotel_id' => 5,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 2,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            // Hotel 6
            [
                'hotel_id' => 6,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 1,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            [
                'hotel_id' => 6,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 2,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            // Hotel 7
            [
                'hotel_id' => 7,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 1,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            [
                'hotel_id' => 7,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 2,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            // Hotel 8
            [
                'hotel_id' => 8,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 1,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            [
                'hotel_id' => 8,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 2,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            // Hotel 9
            [
                'hotel_id' => 9,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 1,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            [
                'hotel_id' => 9,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 2,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            // Hotel 10
            [
                'hotel_id' => 10,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 1,
                'created_at' => now (),
                'updated_at' => now (),
            ],
            [
                'hotel_id' => 10,
                'filepath' => 'images/600x400.webp',
                'filesize' => 2048,
                'position' => 2,
                'created_at' => now (),
                'updated_at' => now (),
            ],
        ]);
    }
}
