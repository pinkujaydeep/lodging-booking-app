'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getRoomById, getLodgeBySlug } from '@/lib/db';
import { Room, Lodge } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import { useBookingStore } from '@/lib/store';
import Link from 'next/link';

function RoomDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const roomId = params.rid as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [lodge, setLodge] = useState<Lodge | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { user } = useAuthStore();
  const {
    checkInDate,
    checkOutDate,
    guests,
    rooms: bookingRooms,
    setCheckInDate,
    setCheckOutDate,
    setGuests,
    setRooms: setBookingRooms,
    setSelectedRoom,
  } = useBookingStore();

  const [localCheckIn, setLocalCheckIn] = useState<string>('');
  const [localCheckOut, setLocalCheckOut] = useState<string>('');
  const [localGuests, setLocalGuests] = useState<number>(guests || 1);
  const [localRooms, setLocalRooms] = useState<number>(bookingRooms || 1);
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lodgeData = await getLodgeBySlug(slug);
        setLodge(lodgeData);

        if (lodgeData) {
          const roomData = await getRoomById(roomId);
          setRoom(roomData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, roomId]);

  const handleProceedToCheckout = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!localCheckIn || !localCheckOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    const checkInObj = new Date(localCheckIn);
    const checkOutObj = new Date(localCheckOut);

    if (checkInObj >= checkOutObj) {
      alert('Check-out date must be after check-in date');
      return;
    }

    setCheckInDate(checkInObj);
    setCheckOutDate(checkOutObj);
    setGuests(localGuests);
    setBookingRooms(localRooms);
    setSelectedRoom(room!);

    // Redirect to checkout with room info in URL
    router.push(`/checkout?roomId=${roomId}&lodgeId=${lodge?.id}&lodgeSlug=${slug}`);
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
        <Link href={`/stay/${slug}`} className="text-blue-600 hover:underline mt-4 block">
          ← Back to {lodge?.name || 'lodge'}
        </Link>
      </div>
    );
  }

  const roomTypeLabel = {
    single: 'Single Room',
    double: 'Double Room',
    suite: 'Suite',
    dormitory: 'Dormitory',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href={`/stay/${slug}`} className="text-blue-600 hover:underline">
            ← Back to {lodge.name}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="md:col-span-2">
            {/* Image Carousel */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md mb-6">
              <div className="relative bg-gray-200 h-96">
                {room.imageUrls && room.imageUrls.length > 0 ? (
                  <>
                    <img
                      src={room.imageUrls[currentImageIndex]}
                      alt={`${room.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {room.imageUrls.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentImageIndex(
                              (prev) =>
                                (prev - 1 + room.imageUrls.length) %
                                room.imageUrls.length
                            )
                          }
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                        >
                          ❮
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImageIndex(
                              (prev) => (prev + 1) % room.imageUrls.length
                            )
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                        >
                          ❯
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {room.imageUrls.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentImageIndex
                                  ? 'bg-white'
                                  : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No images available
                  </div>
                )}
              </div>

              {/* Image Counter */}
              {room.imageUrls && room.imageUrls.length > 0 && (
                <div className="px-4 py-2 bg-gray-100 text-sm text-gray-600">
                  Image {currentImageIndex + 1} of {room.imageUrls.length}
                </div>
              )}
            </div>

            {/* Room Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
                  <p className="text-blue-600 font-semibold">
                    {roomTypeLabel[room.roomType]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">
                    ${room.basePrice}
                  </p>
                  <p className="text-gray-600">per night</p>
                </div>
              </div>

              <hr className="my-4" />

              {/* Room Specs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👥</span>
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-semibold">{room.capacity} guests</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏠</span>
                  <div>
                    <p className="text-sm text-gray-600">Available Rooms</p>
                    <p className="font-semibold">{room.totalRooms}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{room.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Book Your Stay</h2>

              <div className="space-y-4">
                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={localCheckIn}
                    onChange={(e) => setLocalCheckIn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={localCheckOut}
                    onChange={(e) => setLocalCheckOut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={room.capacity * (bookingRooms || 1)}
                    value={localGuests}
                    onChange={(e) => setLocalGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Number of Rooms */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Number of Rooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={room.totalRooms}
                    value={localRooms}
                    onChange={(e) => setLocalRooms(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special requests or preferences?"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>

                {/* Price Summary */}
                {localCheckIn && localCheckOut && (
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Nights:</span>
                      <span>
                        {Math.ceil(
                          (new Date(localCheckOut).getTime() -
                            new Date(localCheckIn).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Rooms:</span>
                      <span>{localRooms}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Price per night:</span>
                      <span>${room.basePrice}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        $
                        {(
                          Math.ceil(
                            (new Date(localCheckOut).getTime() -
                              new Date(localCheckIn).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) *
                          room.basePrice *
                          localRooms
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Proceed to Checkout Button */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
                >
                  {user ? 'Proceed to Checkout' : 'Login to Book'}
                </button>

                {!user && (
                  <p className="text-sm text-gray-600 text-center">
                    You need to login to book a room
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Loading room details...</p>
        </div>
      }
    >
      <RoomDetailContent />
    </Suspense>
  );
}
