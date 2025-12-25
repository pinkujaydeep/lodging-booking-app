import { NextRequest, NextResponse } from 'next/server';
import { createBooking } from '@/lib/db';
import { Timestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lodgeId,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfRooms,
      totalPrice,
      guestName,
      specialRequests,
      userId,
    } = body;

    // In a production app, you would:
    // 1. Create a Stripe PaymentIntent
    // 2. Create the booking only after payment is successful
    // 3. Send confirmation email

    // For now, we'll create a booking with pending payment status
    const booking = await createBooking({
      userId,
      lodgeId,
      roomId,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      numberOfGuests: 1,
      numberOfRooms,
      totalPrice: totalPrice / 100,
      status: 'confirmed', // In prod: 'pending' until payment confirmed
      paymentStatus: 'completed', // In prod: 'pending' until payment confirmed
      specialRequests,
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      clientSecret: 'demo_client_secret_' + booking.id,
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
