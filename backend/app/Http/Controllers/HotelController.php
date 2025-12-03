<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\HotelsPicture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HotelController extends Controller
{
    /**
     * Récupère la liste paginée des hôtels avec leurs images
     */
    public function getHotels(Request $request)
    {
        $perPage = $request->input('per_page', 12);

        // Charge les hôtels avec leurs images et applique les filtres de recherche
        $hotels = Hotel::with('pictures')
                    ->filter($request->all())
                    ->paginate($perPage);

        return response()->json([
            'data' => $hotels->items(),
            'meta' => [
                'current_page' => $hotels->currentPage(),
                'last_page' => $hotels->lastPage(),
                'per_page' => $hotels->perPage(),
                'total' => $hotels->total()
            ]
        ]);
    }

    /**
     * Récupère un hôtel spécifique par son ID
     */
    public function getHotel($id)
    {
        $hotel = Hotel::with('pictures')->find($id);
        
        if (!$hotel) {
            return response()->json(['error' => 'Hotel not found'], 404);
        }

        return response()->json($hotel);
    }

    /**
     * Crée un nouvel hôtel avec ses images
     * Les images sont stockées dans storage/app/public/hotels
     */
    public function createHotel(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address1' => 'required|string',
            'address2' => 'nullable|string',
            'zipcode' => 'required|string',
            'city' => 'required|string',
            'country' => 'required|string',
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
            'description' => 'required|string|max:5000',
            'max_capacity' => 'required|integer|min:1|max:200',
            'price_per_night' => 'required|numeric|min:0',
            'pictures' => 'required|array|min:1',
            'pictures.*' => 'image|mimes:jpeg,png,webp|max:5120'
        ]);

        try {
            $hotel = Hotel::create($validated);

            // Upload et enregistrement de chaque image avec sa position
            foreach ($request->file('pictures') as $index => $file) {
                // Stockage dans public/hotels avec nom unique généré par Laravel
                $path = $file->store('hotels', 'public');

                HotelsPicture::create([
                    'hotel_id' => $hotel->id,
                    'filepath' => $path,
                    'filesize' => $file->getSize(),
                    'position' => $index // Position commence à 0
                ]);
            }

            return response()->json([
                'message' => 'Hotel created successfully',
                'hotel' => $hotel->load('pictures')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create hotel',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime un hôtel et ses images associées
     * Nettoie le système de fichiers ET la base de données
     */
    public function deleteHotel($id)
    {
        $hotel = Hotel::with('pictures')->find($id);

        if (!$hotel) {
            return response()->json(['error' => 'Hotel not found'], 404);
        }

        try {
            // Suppression de toutes les images physiques puis leurs entrées BDD
            foreach ($hotel->pictures as $picture) {
                // Suppression du fichier du storage
                if (Storage::disk('public')->exists($picture->filepath)) {
                    Storage::disk('public')->delete($picture->filepath);
                }
                // Suppression de l'entrée en BDD
                $picture->delete();
            }

            // Suppression de l'hôtel (cascade automatique si configuré)
            $hotel->delete();

            return response()->json(['message' => 'Hotel deleted successfully'], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete hotel',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Met à jour un hôtel avec gestion avancée des images
     * - Suppression des images marquées comme deleted
     * - Mise à jour des positions des images existantes
     * - Ajout de nouvelles images
     */
    public function updateHotel(Request $request, $id)
    {
        $hotel = Hotel::with('pictures')->find($id);

        if (!$hotel) {
            return response()->json(['error' => 'Hotel not found'], 404);
        }

        // Validation des champs de l'hôtel
        $validatedData = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'address1'  => 'sometimes|string',
            'address2'  => 'sometimes|nullable|string',
            'zipcode'   => 'sometimes|string',
            'city'  => 'sometimes|string',
            'country'   => 'sometimes|string',
            'lat'   => 'sometimes|numeric|between:-90,90',
            'lng'   => 'sometimes|numeric|between:-180,180',
            'description'   => 'sometimes|string|max:5000',
            'max_capacity'  => 'sometimes|integer|min:1|max:200',
            'price_per_night'   => 'sometimes|numeric|min:0',
        ]);

        // Validation des images
        $validatedImages = $request->validate([
            'pictures'             => 'sometimes|array',
            'pictures.*'           => 'image|mimes:jpeg,png,webp|max:5120',
            'existing_pictures'    => 'sometimes|array',
            'existing_pictures.*.id' => 'required|integer',
            'existing_pictures.*.position' => 'required|integer',
            'deleted_pictures'     => 'sometimes|array',
            'deleted_pictures.*'   => 'integer'
        ]);

        try {
            // 1. Mise à jour des données de l'hôtel
            $hotel->update($validatedData);

            // 2. Suppression des images marquées pour suppression
            if ($request->has('deleted_pictures')) {
                foreach ($request->deleted_pictures as $picId) {
                    $picture = $hotel->pictures()->find($picId);

                    if ($picture) {
                        // Suppression du fichier physique
                        Storage::disk('public')->delete($picture->filepath);
                        // Suppression de l'entrée BDD
                        $picture->delete();
                    }
                }
            }

            // 3. Mise à jour des positions des images existantes
            if ($request->has('existing_pictures')) {
                foreach ($request->existing_pictures as $existingPicture) {
                    $picture = $hotel->pictures()->find($existingPicture['id']);

                    if ($picture) {
                        $picture->update(['position' => $existingPicture['position']]);
                    }
                }
            }

            // 4. Ajout de nouvelles images
            if ($request->hasFile('pictures')) {
                // Calcul de la position de départ pour les nouvelles images
                $existingCount = $request->has('existing_pictures')
                    ? count($request->existing_pictures)
                    : 0;

                foreach ($request->file('pictures') as $index => $file) {
                    $path = $file->store('hotels', 'public');

                    HotelsPicture::create([
                        'hotel_id' => $hotel->id,
                        'filepath' => $path,
                        'filesize' => $file->getSize(),
                        'position' => $existingCount + $index
                    ]);
                }
            }

            return response()->json([
                'message' => 'Hotel updated successfully',
                'hotel'   => $hotel->fresh()->load('pictures')
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update hotel',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}