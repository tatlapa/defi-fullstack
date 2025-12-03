<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Requête de validation pour la création d'un hôtel
 * Gère la validation des champs de base et des images uploadées
 */
class CreateHotelRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation pour la création d'un hôtel
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'address1' => ['required', 'string', 'min:5', 'max:500'],
            'address2' => ['nullable', 'string', 'max:500'],
            'zipcode' => ['required', 'string', 'min:2', 'max:20'],
            'city' => ['required', 'string', 'min:2', 'max:100'],
            'country' => ['required', 'string', 'min:2', 'max:100'],
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
            'description' => ['required', 'string', 'min:10', 'max:5000'],
            'max_capacity' => ['required', 'integer', 'min:1', 'max:1000'],
            'price_per_night' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'pictures' => ['required', 'array', 'min:1', 'max:20'],
            'pictures.*' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120', 'dimensions:min_width=100,min_height=100'],
        ];
    }

    /**
     * Messages d'erreur pour chaque champ
     */
    public function messages(): array
    {
        return [
            // Nom
            'name.required' => 'Le nom de l\'hôtel est obligatoire.',
            'name.min' => 'Le nom doit contenir au moins 3 caractères.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',

            // Adresse
            'address1.required' => 'L\'adresse principale est obligatoire.',
            'address1.min' => 'L\'adresse doit contenir au moins 5 caractères.',
            'address1.max' => 'L\'adresse ne peut pas dépasser 500 caractères.',
            'address2.max' => 'L\'adresse complémentaire ne peut pas dépasser 500 caractères.',
            'zipcode.required' => 'Le code postal est obligatoire.',
            'zipcode.min' => 'Le code postal doit contenir au moins 2 caractères.',
            'city.required' => 'La ville est obligatoire.',
            'city.min' => 'La ville doit contenir au moins 2 caractères.',
            'country.required' => 'Le pays est obligatoire.',
            'country.min' => 'Le pays doit contenir au moins 2 caractères.',

            // Latitude Longitude
            'lat.required' => 'La latitude est obligatoire.',
            'lat.numeric' => 'La latitude doit être un nombre.',
            'lat.between' => 'La latitude doit être comprise entre -90 et 90.',
            'lng.required' => 'La longitude est obligatoire.',
            'lng.numeric' => 'La longitude doit être un nombre.',
            'lng.between' => 'La longitude doit être comprise entre -180 et 180.',

            // Description
            'description.required' => 'La description est obligatoire.',
            'description.min' => 'La description doit contenir au moins 10 caractères.',
            'description.max' => 'La description ne peut pas dépasser 5000 caractères.',

            // Capacité et prix
            'max_capacity.required' => 'La capacité maximale est obligatoire.',
            'max_capacity.integer' => 'La capacité doit être un nombre entier.',
            'max_capacity.min' => 'La capacité doit être au minimum de 1 personne.',
            'max_capacity.max' => 'La capacité ne peut pas dépasser 1000 personnes.',
            'price_per_night.required' => 'Le prix par nuit est obligatoire.',
            'price_per_night.numeric' => 'Le prix doit être un nombre.',
            'price_per_night.min' => 'Le prix ne peut pas être négatif.',
            'price_per_night.max' => 'Le prix ne peut pas dépasser 999999.99.',

            // Images
            'pictures.required' => 'Au moins une image est requise.',
            'pictures.min' => 'Au moins une image est requise.',
            'pictures.max' => 'Vous ne pouvez pas télécharger plus de 20 images.',
            'pictures.*.required' => 'Une image valide est requise.',
            'pictures.*.image' => 'Le fichier doit être une image valide.',
            'pictures.*.mimes' => 'Formats d\'image acceptés : JPEG, PNG, WEBP.',
            'pictures.*.max' => 'Chaque image ne doit pas dépasser 5 Mo.',
            'pictures.*.dimensions' => 'Chaque image doit avoir au minimum 100x100 pixels.',
        ];
    }
}
