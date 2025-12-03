import * as z from "zod";

/**
 * Schéma de validation Zod pour un hôtel
 * Correspond aux règles de validation Laravel
 */
export const hotelSchema = z.object({
  // Informations générales
  name: z
    .string()
    .min(1, "Le nom est requis")
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(255, "Le nom ne peut pas dépasser 255 caractères"),

  // Adresse
  address1: z
    .string()
    .min(1, "L'adresse est requise")
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(500, "L'adresse ne peut pas dépasser 500 caractères"),

  address2: z
    .string()
    .max(500, "L'adresse complémentaire ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),

  zipcode: z
    .string()
    .min(1, "Le code postal est requis")
    .min(2, "Le code postal doit contenir au moins 2 caractères")
    .max(20, "Le code postal ne peut pas dépasser 20 caractères"),

  city: z
    .string()
    .min(1, "La ville est requise")
    .min(2, "La ville doit contenir au moins 2 caractères")
    .max(100, "La ville ne peut pas dépasser 100 caractères"),

  country: z
    .string()
    .min(1, "Le pays est requis")
    .min(2, "Le pays doit contenir au moins 2 caractères")
    .max(100, "Le pays ne peut pas dépasser 100 caractères"),

  // Coordonnées GPS
  lat: z
    .string()
    .min(1, "La latitude est requise")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= -90 && num <= 90;
      },
      { message: "La latitude doit être comprise entre -90 et 90" }
    ),

  lng: z
    .string()
    .min(1, "La longitude est requise")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= -180 && num <= 180;
      },
      { message: "La longitude doit être comprise entre -180 et 180" }
    ),

  // Détails
  description: z
    .string()
    .min(1, "La description est requise")
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(5000, "La description ne peut pas dépasser 5000 caractères"),

  max_capacity: z
    .number()
    .min(1, "La capacité doit être au minimum de 1 personne")
    .max(200, "La capacité ne peut pas dépasser 200 personnes"),

  price_per_night: z
    .number()
    .min(1, "Le prix ne peut pas être négatif")
    .max(999999.99, "Le prix ne peut pas dépasser 999999.99"),
});

/**
 * Type TypeScript inféré du schéma Zod
 */
export type HotelFormData = z.infer<typeof hotelSchema>;
