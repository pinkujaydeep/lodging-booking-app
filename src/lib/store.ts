import { create } from 'zustand';
import { Room } from './types';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'customer' | 'admin' | 'lodge_manager';
  lodgeId?: string;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

interface BookingStore {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  guests: number;
  rooms: number;
  selectedRoom: Room | null;
  setCheckInDate: (date: Date | null) => void;
  setCheckOutDate: (date: Date | null) => void;
  setGuests: (guests: number) => void;
  setRooms: (rooms: number) => void;
  setSelectedRoom: (room: Room | null) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  checkInDate: null,
  checkOutDate: null,
  guests: 1,
  rooms: 1,
  selectedRoom: null,
  setCheckInDate: (date) => set({ checkInDate: date }),
  setCheckOutDate: (date) => set({ checkOutDate: date }),
  setGuests: (guests) => set({ guests }),
  setRooms: (rooms) => set({ rooms }),
  setSelectedRoom: (room) => set({ selectedRoom: room }),
  reset: () =>
    set({
      checkInDate: null,
      checkOutDate: null,
      guests: 1,
      rooms: 1,
      selectedRoom: null,
    }),
}));
