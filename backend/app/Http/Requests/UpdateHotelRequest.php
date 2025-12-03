<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Requête de validation pour la mise à jour d'un hôtel
 * Tous les champs sont optionnels (sometimes) pour permettre les mises à jour partielles
 */
class UpdateHotelRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation pour la mise à jour d'un hôtel
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'min:3', 'max:255'],
            'address1' => ['sometimes', 'string', 'min:5', 'max:500'],
            'address2' => ['sometimes', 'nullable', 'string', 'max:500'],
            'zipcode' => ['sometimes', 'string', 'min:2', 'max:20'],
            'city' => ['sometimes', 'string', 'min:2', 'max:100'],
            'country' => ['sometimes', 'string', 'min:2', 'max:100'],
            'lat' => ['sometimes', 'numeric', 'between:-90,90'],
            'lng' => ['sometimes', 'numeric', 'between:-180,180'],
            'description' => ['sometimes', 'string', 'min:10', 'max:5000'],
            'max_capacity' => ['sometimes', 'integer', 'min:1', 'max:1000'],
            'price_per_night' => ['sometimes', 'numeric', 'min:0', 'max:999999.99'],
            'pictures' => ['sometimes', 'array', 'max:20'],
            'pictures.*' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120', 'dimensions:min_width=100,min_height=100'],
            'existing_pictures' => ['sometimes', 'array', 'max:20'],
            'existing_pictures.*.id' => ['required', 'integer', 'exists:hotels_pictures,id'],
            'existing_pictures.*.position' => ['required', 'integer', 'min:0'],
            'deleted_pictures' => ['sometimes', 'array'],
            'deleted_pictures.*' => ['integer', 'exists:hotels_pictures,id'],
        ];
    }

    /**
     * Messages d'erreur personnalisés en français
     */
    public function messages(): array
    {
        return [
            // Nom
            'name.min' => 'Le nom doit contenir au moins 3 caractères.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',

            // Adresse
            'address1.min' => 'L\'adresse doit contenir au moins 5 caractères.',
            'address1.max' => 'L\'adresse ne peut pas dépasser 500 caractères.',
            'address2.max' => 'L\'adresse complémentaire ne peut pas dépasser 500 caractères.',
            'zipcode.min' => 'Le code postal doit contenir au moins 2 caractères.',
            'city.min' => 'La ville doit contenir au moins 2 caractères.',
            'country.min' => 'Le pays doit contenir au moins 2 caractères.',

            // Coordonnées GPS
            'lat.numeric' => 'La latitude doit être un nombre.',
            'lat.between' => 'La latitude doit être comprise entre -90 et 90.',
            'lng.numeric' => 'La longitude doit être un nombre.',
            'lng.between' => 'La longitude doit être comprise entre -180 et 180.',

            // Description
            'description.min' => 'La description doit contenir au moins 10 caractères.',
            'description.max' => 'La description ne peut pas dépasser 5000 caractères.',

            // Capacité et prix
            'max_capacity.integer' => 'La capacité doit être un nombre entier.',
            'max_capacity.min' => 'La capacité doit être au minimum de 1 personne.',
            'max_capacity.max' => 'La capacité ne peut pas dépasser 1000 personnes.',
            'price_per_night.numeric' => 'Le prix doit être un nombre.',
            'price_per_night.min' => 'Le prix ne peut pas être négatif.',
            'price_per_night.max' => 'Le prix ne peut pas dépasser 999999.99.',

            // Nouvelles images
            'pictures.max' => 'Vous ne pouvez pas télécharger plus de 20 images.',
            'pictures.*.required' => 'Une image valide est requise.',
            'pictures.*.image' => 'Le fichier doit être une image valide.',
            'pictures.*.mimes' => 'Formats d\'image acceptés : JPEG, PNG, WEBP.',
            'pictures.*.max' => 'Chaque image ne doit pas dépasser 5 Mo.',
            'pictures.*.dimensions' => 'Chaque image doit avoir au minimum 100x100 pixels.',

            // Images existantes
            'existing_pictures.max' => 'Maximum 20 images autorisées.',
            'existing_pictures.*.id.required' => 'L\'ID de l\'image est requis.',
            'existing_pictures.*.id.integer' => 'L\'ID de l\'image doit être un nombre entier.',
            'existing_pictures.*.id.exists' => 'L\'image spécifiée n\'existe pas.',
            'existing_pictures.*.position.required' => 'La position est requise.',
            'existing_pictures.*.position.integer' => 'La position doit être un nombre entier.',
            'existing_pictures.*.position.min' => 'La position doit être positive ou nulle.',

            // Images supprimées
            'deleted_pictures.*.integer' => 'L\'ID de l\'image à supprimer doit être un nombre entier.',
            'deleted_pictures.*.exists' => 'L\'image à supprimer n\'existe pas.',
        ];
    }
}
