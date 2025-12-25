'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { getBookingsByUser, getLodgeById, getRoomById } from '@/lib/db';
import { Booking, Lodge, Room } from '@/lib/types';

interface BookingWithDetails extends Booking {
  lodge?: Lodge;
  room?: Room;
}

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const bookingsData = await getBookingsByUser(user.uid);

        // Fetch lodge and room details for each booking
        const bookingsWithDetails = await Promise.all(
          bookingsData.map(async (booking) => {
            const lodge = await getLodgeById(booking.lodgeId);
            const room = await getRoomById(booking.roomId);
            return { ...booking, lodge: lodge || undefined, room: room || undefined };
          })
        );

        setBookings(bookingsWithDetails);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">You haven&apos;t made any bookings yet</p>
          <a
            href="/lodges"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Browse Lodges
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">{booking.lodge?.name || 'Unknown Lodge'}</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Room:</span> {booking.room?.name || 'Unknown Room'}
                    </p>
                    <p>
                      <span className="font-semibold">Check-in:</span>{' '}
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Check-out:</span>{' '}
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Guests:</span> {booking.numberOfGuests}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-2xl font-bold text-blue-600">${booking.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
