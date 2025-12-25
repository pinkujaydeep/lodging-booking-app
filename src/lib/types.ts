export interface Lodge {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier (e.g., 'grand-plaza-hotel')
  description: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  rating: number;
  totalReviews: number;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  isActive: boolean;
  contactEmail: string;
  contactPhone: string;
}

export interface Room {
  id: string;
  lodgeId: string;
  name: string;
  description: string;
  roomType: 'single' | 'double' | 'suite' | 'dormitory';
  capacity: number;
  basePrice: number;
  currency: string;
  amenities: string[];
  imageUrls: string[];
  totalRooms: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  lodgeId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  numberOfRooms: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomAvailability {
  id: string;
  roomId: string;
  date: string; // YYYY-MM-DD format
  availableRooms: number;
  price: number;
}

export interface Review {
  id: string;
  lodgeId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'customer' | 'admin' | 'lodge_manager';
  lodgeId?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  createdAt: Date;
  updatedAt: Date;
}
