export interface HotelsPicture {
  id: number;
  hotel_id: number;
  filepath: string;
  filesize: number;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Hotel {
  id: number;
  name: string;
  address1: string;
  address2?: string;
  zipcode: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  description: string;
  max_capacity: number;
  price_per_night: number;
  pictures?: HotelsPicture[];
  created_at: string;
  updated_at: string;
}
