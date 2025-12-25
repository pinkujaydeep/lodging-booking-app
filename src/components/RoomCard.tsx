'use client';

import { Room } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

interface RoomCardProps {
  room: Room;
  lodgeId: string;
  lodgeName?: string;
  lodgeSlug?: string;
}

export default function RoomCard({ room, lodgeId, lodgeName, lodgeSlug }: RoomCardProps) {
  // Use slug if available, otherwise use lodgeId for backward compatibility
  const roomLink = lodgeSlug 
    ? `/stay/${lodgeSlug}/rooms/${room.id}`
    : `/lodges/${lodgeId}/rooms/${room.id}`;
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-40 w-full bg-gray-200">
        {room.imageUrls && room.imageUrls.length > 0 ? (
          <Image
            src={room.imageUrls[0]}
            alt={room.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">{room.name}</h4>

        <p className="text-sm text-gray-600 mb-3">{room.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
          <div>
            <p className="text-gray-500">Type</p>
            <p className="font-semibold capitalize">{room.roomType}</p>
          </div>
          <div>
            <p className="text-gray-500">Capacity</p>
            <p className="font-semibold">{room.capacity} guests</p>
          </div>
          <div>
            <p className="text-gray-500">Available Rooms</p>
            <p className="font-semibold">{room.totalRooms}</p>
          </div>
          <div>
            <p className="text-gray-500">Price/Night</p>
            <p className="font-semibold">
              ${room.basePrice} {room.currency}
            </p>
          </div>
        </div>

        {room.amenities.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Amenities:</p>
            <div className="flex flex-wrap gap-1">
              {room.amenities.slice(0, 2).map((amenity) => (
                <span key={amenity} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href={roomLink}
          className="block text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
        >
          Book Room
        </Link>
      </div>
    </div>
  );
}
