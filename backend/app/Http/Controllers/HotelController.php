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

            // Enregistre chaque image uploadée
            foreach ($request->file('pictures') as $index => $file) {
                $path = $file->store('hotels', 'public');
                
                HotelsPicture::create([
                    'hotel_id' => $hotel->id,
                    'filepath' => $path,
                    'filesize' => $file->getSize(),
                    'position' => $index + 1
                ]);
            }
            
            return response()->json([
                'message' => 'Hotel created successfully',
                'hotel' => $hotel->load('pictures')
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create hotel'], 500);
        }
    }

    /**
     * Supprime un hôtel et ses images associées
     */
    public function deleteHotel($id)
    {
        $hotel = Hotel::find($id);
        
        if (!$hotel) {
            return response()->json(['error' => 'Hotel not found'], 404);
        }

        try {
            // Supprime les fichiers images du storage puis les entrées en BDD
            foreach ($hotel->pictures as $picture) {
                Storage::disk('public')->delete($picture->filepath);
                $picture->delete();
            }

            $hotel->delete();
            
            return response()->json(['message' => 'Hotel deleted successfully'], 200);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete hotel'], 500);
        }
    }

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
            'new_pictures'         => 'sometimes|array',
            'new_pictures.*'       => 'image|mimes:jpeg,png,webp|max:5120',
            'delete_pictures'      => 'sometimes|array',
            'delete_pictures.*'    => 'integer'
        ]);

        try {

            // Mise à jour de l'hôtel (OK maintenant)
            $hotel->update($validatedData);

            // Suppression d'images
            if ($request->has('delete_pictures')) {
                foreach ($request->delete_pictures as $picId) {

                    $picture = $hotel->pictures()->find($picId);

                    if ($picture) {
                        Storage::disk('public')->delete($picture->filepath);
                        $picture->delete();
                    }
                }
            }

            // Ajout de nouvelles images
            if ($request->hasFile('new_pictures')) {

                $currentPosition = $hotel->pictures()->max('position') ?? 0;

                foreach ($request->file('new_pictures') as $index => $file) {

                    $path = $file->store('hotels', 'public');

                    HotelsPicture::create([
                        'hotel_id' => $hotel->id,
                        'filepath' => $path,
                        'filesize' => $file->getSize(),
                        'position' => $currentPosition + $index + 1
                    ]);
                }
            }

            return response()->json([
                'message' => 'Hotel updated successfully',
                'hotel'   => $hotel->load('pictures')
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update hotel'], 500);
        }
    }
}