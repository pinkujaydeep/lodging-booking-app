'use client';

import { useEffect, useState } from 'react';
import { getLodges } from '@/lib/db';
import { Lodge } from '@/lib/types';
import LodgeCard from '@/components/LodgeCard';

export default function LodgesPage() {
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLodges = async () => {
      try {
        const data = await getLodges({ isActive: true });
        setLodges(data);
      } catch (error) {
        console.error('Failed to fetch lodges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLodges();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Available Lodges</h1>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading lodges...</p>
        </div>
      ) : lodges.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No lodges available at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lodges.map((lodge) => (
            <LodgeCard key={lodge.id} lodge={lodge} />
          ))}
        </div>
      )}
    </div>
  );
}
