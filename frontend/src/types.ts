/**
 * Représente une image associée à un hôtel
 * Position permet le réordonnancement par drag & drop
 */
export interface HotelsPicture {
  id: number;
  hotel_id: number;
  filepath: string; // Chemin relatif depuis storage/
  filesize: number;
  position: number; // Index de position pour le tri
  created_at: string;
  updated_at: string;
}

/**
 * Modèle principal d'un hôtel
 * Correspond au modèle Laravel Hotel
 */
export interface Hotel {
  id: number;
  name: string;
  address1: string;
  address2?: string;
  zipcode: string;
  city: string;
  country: string;
  lat: number; // Latitude pour affichage carte
  lng: number; // Longitude pour affichage carte
  description: string;
  max_capacity: number;
  price_per_night: number;
  pictures?: HotelsPicture[];
  created_at: string;
  updated_at: string;
}
