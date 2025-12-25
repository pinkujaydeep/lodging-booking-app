'use client';

import { Lodge } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

interface LodgeCardProps {
  lodge: Lodge;
}

export default function LodgeCard({ lodge }: LodgeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-48 w-full bg-gray-200">
        {lodge.imageUrl ? (
          <Image
            src={lodge.imageUrl}
            alt={lodge.name}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{lodge.name}</h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lodge.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">
            {lodge.city}, {lodge.country}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-semibold">
              {lodge.rating.toFixed(1)} ({lodge.totalReviews})
            </span>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Amenities:</p>
          <div className="flex flex-wrap gap-1">
            {lodge.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={`/stay/${lodge.slug}`}
          className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Rooms
        </Link>
      </div>
    </div>
  );
}
