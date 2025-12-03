import { create } from 'zustand';
import { Hotel } from '../types';

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface HotelStore {
  hotels: Hotel[];
  currentHotel?: Hotel;
  loading: boolean;
  error?: string;
  pagination?: PaginationMeta;

  fetchHotels: (params?: { page?: number; per_page?: number }) => Promise<void>;
  fetchHotel: (id: string) => Promise<void>;
  createHotel: (formData: FormData) => Promise<void>;
  updateHotel: (id: number, formData: FormData) => Promise<void>;
  deleteHotel: (id: number) => Promise<void>;
  clearCurrentHotel: () => void;
}

export const useHotelStore = create<HotelStore>((set) => ({
  hotels: [],
  currentHotel: undefined,
  loading: false,
  error: undefined,
  pagination: undefined,

  fetchHotels: async (params) => {
    set({ loading: true, error: undefined });
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

      const url = `/api/hotels${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      set({
        hotels: data.data || [],
        pagination: data.meta
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch hotels' });
    } finally {
      set({ loading: false });
    }
  },

  fetchHotel: async (id: string) => {
    set({ loading: true, error: undefined });
    try {
      const res = await fetch(`/api/hotels/${id}`);
      if (!res.ok) throw new Error('Hotel not found');
      const data = await res.json();
      set({ currentHotel: data });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch hotel' });
    } finally {
      set({ loading: false });
    }
  },

  createHotel: async (formData: FormData) => {
    set({ loading: true, error: undefined });
    try {
      const res = await fetch(`/api/hotels`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to create hotel');
      const data = await res.json();
      set({ currentHotel: data.hotel });
    } catch (err: any) {
      set({ error: err.message || 'Failed to create hotel' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateHotel: async (id: number, formData: FormData) => {
    set({ loading: true, error: undefined });
    try {
      const res = await fetch(`/api/hotels/${id}`, {
        method: 'PATCH',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to update hotel');
      const data = await res.json();
      set({ currentHotel: data.hotel });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update hotel' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteHotel: async (id: number) => {
    set({ loading: true, error: undefined });
    try {
      const res = await fetch(`/api/hotels/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete hotel');
      set((state) => ({
        hotels: state.hotels.filter((h) => h.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete hotel' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  clearCurrentHotel: () => set({ currentHotel: undefined }),
}));