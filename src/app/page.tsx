'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBookingStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { setCheckInDate, setCheckOutDate, setGuests, setRooms } = useBookingStore();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuestsLocal] = useState(1);
  const [rooms, setRoomsLocal] = useState(1);

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    setCheckInDate(new Date(checkIn));
    setCheckOutDate(new Date(checkOut));
    setGuests(guests);
    setRooms(rooms);

    router.push('/lodges');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to LodgeBook</h1>
          <p className="text-xl mb-8">Find and book the perfect lodging for your next adventure</p>

          {/* Search Box */}
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Guests</label>
                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuestsLocal(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Rooms</label>
                <input
                  type="number"
                  min="1"
                  value={rooms}
                  onChange={(e) => setRoomsLocal(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
                >
                  Search
                </button>
              </div>
            </div>

            <Link
              href="/lodges"
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
            >
              Browse all lodges →
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose LodgeBook?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-4xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold mb-3">Wide Selection</h3>
            <p className="text-gray-600">
              Browse thousands of unique lodges and accommodations worldwide
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-3">Mobile App</h3>
            <p className="text-gray-600">
              Install as an app on your phone for easy access on the go
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
            <p className="text-gray-600">
              Safe and secure payment processing with multiple options
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Start exploring our collection of amazing lodges today
          </p>
          <Link
            href="/lodges"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Explore Lodges
          </Link>
        </div>
      </div>
    </div>
  );
}
