<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\HotelsPicture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\CreateHotelRequest;
use App\Http\Requests\UpdateHotelRequest;

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
     * Validation gérée par CreateHotelRequest
     */
    public function createHotel(CreateHotelRequest $request)
    {
        try {
            // Les données sont déjà validées par CreateHotelRequest
            $validated = $request->validated();
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
     * Validation gérée par UpdateHotelRequest
     */
    public function updateHotel(UpdateHotelRequest $request, $id)
    {
        $hotel = Hotel::with('pictures')->find($id);

        if (!$hotel) {
            return response()->json(['error' => 'Hotel not found'], 404);
        }

        try {
            // Les données sont déjà validées par UpdateHotelRequest
            $validated = $request->validated();

            // 1. Mise à jour des données de l'hôtel
            // On filtre uniquement les champs de l'hôtel (exclut pictures, existing_pictures, deleted_pictures)
            $hotelData = array_filter($validated, function($key) {
                return !in_array($key, ['pictures', 'existing_pictures', 'deleted_pictures']);
            }, ARRAY_FILTER_USE_KEY);

            $hotel->update($hotelData);

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