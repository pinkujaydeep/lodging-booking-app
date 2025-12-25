import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Query,
  QueryConstraint,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Lodge, Room, Booking, RoomAvailability, Review, UserProfile } from './types';

// Lodge operations
export const getLodges = async (filters?: {
  city?: string;
  isActive?: boolean;
}): Promise<Lodge[]> => {
  const constraints: QueryConstraint[] = [];
  if (filters?.isActive !== undefined) {
    constraints.push(where('isActive', '==', filters.isActive));
  }
  if (filters?.city) {
    constraints.push(where('city', '==', filters.city));
  }
  constraints.push(orderBy('createdAt', 'desc'));

  const q = query(collection(db, 'lodges'), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Lodge[];
};

export const getLodgeById = async (id: string): Promise<Lodge | null> => {
  const doc_ref = doc(db, 'lodges', id);
  const snapshot = await getDoc(doc_ref);
  return snapshot.exists() ? { ...snapshot.data(), id } as Lodge : null;
};

// Get lodge by slug (URL-friendly identifier)
export const getLodgeBySlug = async (slug: string): Promise<Lodge | null> => {
  const q = query(collection(db, 'lodges'), where('slug', '==', slug.toLowerCase()));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0 ? ({ ...snapshot.docs[0].data(), id: snapshot.docs[0].id } as Lodge) : null;
};

export const createLodge = async (data: Omit<Lodge, 'id' | 'createdAt' | 'updatedAt'>) => {
  return addDoc(collection(db, 'lodges'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const updateLodge = async (id: string, data: Partial<Lodge>) => {
  const doc_ref = doc(db, 'lodges', id);
  return updateDoc(doc_ref, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteLodge = async (id: string) => {
  return deleteDoc(doc(db, 'lodges', id));
};

// Room operations
export const getRoomsByLodge = async (lodgeId: string): Promise<Room[]> => {
  const q = query(collection(db, 'rooms'), where('lodgeId', '==', lodgeId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Room[];
};

export const getRoomById = async (id: string): Promise<Room | null> => {
  const doc_ref = doc(db, 'rooms', id);
  const snapshot = await getDoc(doc_ref);
  return snapshot.exists() ? { ...snapshot.data(), id } as Room : null;
};

export const createRoom = async (data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
  return addDoc(collection(db, 'rooms'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const updateRoom = async (id: string, data: Partial<Room>) => {
  const doc_ref = doc(db, 'rooms', id);
  return updateDoc(doc_ref, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteRoom = async (id: string) => {
  return deleteDoc(doc(db, 'rooms', id));
};

// Booking operations
export const getBookingsByUser = async (userId: string): Promise<Booking[]> => {
  const q = query(collection(db, 'bookings'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Booking[];
};

export const getBookingsByLodge = async (lodgeId: string): Promise<Booking[]> => {
  const q = query(collection(db, 'bookings'), where('lodgeId', '==', lodgeId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Booking[];
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  const doc_ref = doc(db, 'bookings', id);
  const snapshot = await getDoc(doc_ref);
  return snapshot.exists() ? { ...snapshot.data(), id } as Booking : null;
};

export const createBooking = async (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
  return addDoc(collection(db, 'bookings'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const updateBooking = async (id: string, data: Partial<Booking>) => {
  const doc_ref = doc(db, 'bookings', id);
  return updateDoc(doc_ref, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

// Room Availability operations
export const getAvailability = async (roomId: string, startDate: string, endDate: string) => {
  const q = query(
    collection(db, 'roomAvailability'),
    where('roomId', '==', roomId),
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as RoomAvailability[];
};

export const createAvailability = async (data: Omit<RoomAvailability, 'id'>) => {
  return addDoc(collection(db, 'roomAvailability'), data);
};

export const updateAvailability = async (id: string, data: Partial<RoomAvailability>) => {
  const doc_ref = doc(db, 'roomAvailability', id);
  return updateDoc(doc_ref, data);
};

// Review operations
export const getReviewsByLodge = async (lodgeId: string): Promise<Review[]> => {
  const q = query(collection(db, 'reviews'), where('lodgeId', '==', lodgeId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Review[];
};

export const createReview = async (data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => {
  return addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

// User Profile operations
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const doc_ref = doc(db, 'users', uid);
  const snapshot = await getDoc(doc_ref);
  return snapshot.exists() ? { ...snapshot.data(), uid } as UserProfile : null;
};

export const createUserProfile = async (data: Omit<UserProfile, 'createdAt' | 'updatedAt'>) => {
  return updateDoc(doc(db, 'users', data.uid), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const doc_ref = doc(db, 'users', uid);
  return updateDoc(doc_ref, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};
