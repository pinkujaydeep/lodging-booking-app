'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getLodgeBySlug, getRoomsByLodge } from '@/lib/db';
import { Lodge, Room } from '@/lib/types';
import RoomCard from '@/components/RoomCard';
import Link from 'next/link';

export default function LodgeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [lodge, setLodge] = useState<Lodge | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lodgeData = await getLodgeBySlug(slug);
        setLodge(lodgeData);

        if (lodgeData) {
          const roomsData = await getRoomsByLodge(lodgeData.id);
          setRooms(roomsData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

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
        <Link href="/lodges" className="text-blue-600 hover:underline mt-4 block">
          ← Back to all lodges
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-200">
        <img
          src={lodge.imageUrl || '/placeholder.jpg'}
          alt={lodge.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-7xl mx-auto px-4 w-full pb-8">
            <h1 className="text-5xl font-bold text-white mb-2">{lodge.name}</h1>
            <p className="text-gray-100 text-lg">
              {lodge.city}, {lodge.country}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link href="/lodges" className="text-blue-600 hover:underline mb-6 block">
          ← Back to all lodges
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold mb-4">About {lodge.name}</h2>
              <p className="text-gray-700 mb-4">{lodge.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl font-bold text-yellow-500">★</span>
                <span className="text-lg font-semibold">
                  {lodge.rating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({lodge.totalReviews} reviews)
                </span>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {lodge.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold">{lodge.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Postal Code</p>
                  <p className="font-semibold">{lodge.zipCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">City</p>
                  <p className="font-semibold">{lodge.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <p className="font-semibold">{lodge.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Contact */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <a href={`mailto:${lodge.contactEmail}`} className="text-blue-600 hover:underline break-all">
                    {lodge.contactEmail}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <a href={`tel:${lodge.contactPhone}`} className="text-blue-600 hover:underline">
                    {lodge.contactPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8">Available Rooms</h2>
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} lodgeId={lodge.id} lodgeName={lodge.name} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg text-center">
              <p className="text-gray-600">No rooms available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
