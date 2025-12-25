'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRoomById, getLodgeById } from '@/lib/db';
import { Room, Lodge } from '@/lib/types';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const lodgeId = params.id as string;
  const roomId = params.rid as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [lodge, setLodge] = useState<Lodge | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomData = await getRoomById(roomId);
        setRoom(roomData);

        const lodgeData = await getLodgeById(lodgeId);
        setLodge(lodgeData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lodgeId, roomId]);

  const handleBooking = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    // Navigate to checkout
    const params = new URLSearchParams({
      lodgeId,
      roomId,
      checkIn,
      checkOut,
      quantity: quantity.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!room || !lodge) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 text-lg">Room not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link href={`/lodges/${lodgeId}`} className="text-blue-600 hover:text-blue-700 mb-6">
        ← Back to {lodge.name}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Room Images */}
        <div>
          {room.imageUrls && room.imageUrls.length > 0 ? (
            <div className="space-y-4">
              <img
                src={room.imageUrls[0]}
                alt={room.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {room.imageUrls.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {room.imageUrls.slice(1, 4).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${room.name} ${index + 2}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">No images available</p>
            </div>
          )}
        </div>

        {/* Room Info and Booking */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{room.name}</h1>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">{room.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-gray-600 text-sm">Room Type</p>
                <p className="font-semibold text-lg capitalize">{room.roomType}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-gray-600 text-sm">Capacity</p>
                <p className="font-semibold text-lg">{room.capacity} guests</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-gray-600 text-sm">Available</p>
                <p className="font-semibold text-lg">{room.totalRooms} rooms</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-gray-600 text-sm">Price per night</p>
                <p className="font-semibold text-lg">${room.basePrice}</p>
              </div>
            </div>

            {room.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Amenities:</h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Book This Room</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Number of Rooms</label>
                <input
                  type="number"
                  min="1"
                  max={room.totalRooms}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
            >
              {user ? 'Proceed to Checkout' : 'Login to Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
