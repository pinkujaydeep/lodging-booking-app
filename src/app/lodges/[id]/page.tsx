'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getLodgeById } from '@/lib/db';
import { getRoomsByLodge } from '@/lib/db';
import { Lodge, Room } from '@/lib/types';
import RoomCard from '@/components/RoomCard';

export default function LodgeDetailPage() {
  const params = useParams();
  const lodgeId = params.id as string;

  const [lodge, setLodge] = useState<Lodge | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lodgeData = await getLodgeById(lodgeId);
        setLodge(lodgeData);

        if (lodgeData) {
          const roomsData = await getRoomsByLodge(lodgeId);
          setRooms(roomsData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lodgeId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!lodge) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 text-lg">Lodge not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Lodge Header */}
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">{lodge.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            {lodge.imageUrl && (
              <img
                src={lodge.imageUrl}
                alt={lodge.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>

          <div>
            <p className="text-gray-600 mb-4">{lodge.description}</p>

            <div className="space-y-2 mb-4">
              <p>
                <span className="font-semibold">Location:</span> {lodge.address}, {lodge.city},
                {lodge.country}
              </p>
              <p>
                <span className="font-semibold">Rating:</span> ⭐ {lodge.rating.toFixed(1)} (
                {lodge.totalReviews} reviews)
              </p>
              <p>
                <span className="font-semibold">Contact:</span> {lodge.contactEmail} |{' '}
                {lodge.contactPhone}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Amenities:</h3>
              <div className="flex flex-wrap gap-2">
                {lodge.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <h2 className="text-3xl font-bold mb-8">Available Rooms</h2>

      {rooms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No rooms available at this lodge</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} lodgeId={lodgeId} />
          ))}
        </div>
      )}
    </div>
  );
}
