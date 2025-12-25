'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getRoomById, getLodgeById } from '@/lib/db';
import { Room, Lodge } from '@/lib/types';
import { useAuthStore } from '@/lib/store';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const lodgeId = searchParams.get('lodgeId');
  const roomId = searchParams.get('roomId');
  const checkInStr = searchParams.get('checkIn');
  const checkOutStr = searchParams.get('checkOut');
  const quantity = parseInt(searchParams.get('quantity') || '1');

  const [room, setRoom] = useState<Room | null>(null);
  const [lodge, setLodge] = useState<Lodge | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (roomId && lodgeId) {
          const roomData = await getRoomById(roomId);
          setRoom(roomData);

          const lodgeData = await getLodgeById(lodgeId);
          setLodge(lodgeData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, roomId, lodgeId, router]);

  const checkIn = checkInStr ? new Date(checkInStr) : null;
  const checkOut = checkOutStr ? new Date(checkOutStr) : null;
  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = room ? room.basePrice * nights * quantity : 0;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName.trim()) {
      alert('Please enter guest name');
      return;
    }

    setProcessing(true);

    try {
      // In a real app, you would call your backend API to create a payment intent
      // and create the booking
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lodgeId,
          roomId,
          checkInDate: checkInStr,
          checkOutDate: checkOutStr,
          numberOfRooms: quantity,
          totalPrice: Math.round(totalPrice * 100), // Convert to cents
          guestName,
          specialRequests,
        }),
      });

      const { clientSecret } = await response.json();

      // For demo purposes, we'll just show a success message
      // In production, you'd use Stripe.js to handle the payment
      alert('Booking created successfully! Payment would be processed here.');
      router.push(`/bookings`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Booking creation failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!room || !lodge || !checkIn || !checkOut) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 text-lg">Invalid checkout parameters</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Confirm Your Booking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

          <div className="space-y-4 pb-6 border-b">
            <div>
              <p className="text-gray-600">Lodge</p>
              <p className="font-semibold">{lodge.name}</p>
            </div>

            <div>
              <p className="text-gray-600">Room</p>
              <p className="font-semibold">{room.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Check-in</p>
                <p className="font-semibold">{checkIn.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Check-out</p>
                <p className="font-semibold">{checkOut.toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Number of Nights</p>
                <p className="font-semibold">{nights}</p>
              </div>
              <div>
                <p className="text-gray-600">Number of Rooms</p>
                <p className="font-semibold">{quantity}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-600">Price per Night</p>
              <p className="font-semibold">${room.basePrice}</p>
            </div>
          </div>

          <div className="pt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${(room.basePrice * nights * quantity).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Taxes & Fees</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Guest Information</h2>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Guest Name *</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Special Requests</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any special requests for your stay?"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded text-sm text-gray-600 mb-6">
              <p className="font-semibold mb-2">Payment Method</p>
              <p>For this demo, payment processing is simulated. In production, Stripe integration would be fully implemented.</p>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
            >
              {processing ? 'Processing...' : `Complete Booking - $${totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center"><p className="text-gray-600">Loading...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
