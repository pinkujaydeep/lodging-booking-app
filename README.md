# LodgeBook - Multi-Tenant Lodging Booking Platform

A modern, plug-and-play lodging booking platform built with Next.js, Firebase, and Stripe. Features a fully functional PWA that can be installed on mobile devices, making it perfect for both desktop and mobile users.

## 🚀 Quick Start

👉 **[See all documentation in `/docs` folder](docs/)**  
👉 **[START HERE →](docs/START_HERE.md)**

## Features

- 🏨 **Multi-Tenant Architecture** - Manage multiple lodges from a single platform
- 🔗 **Lodge-Specific URLs** - Each property has a branded URL (e.g., `/stay/sunny-beach-resort`)
- 📱 **Progressive Web App** - Install as a native app on iOS and Android
- 🔐 **Firebase Authentication** - Secure user registration and login
- 💳 **Stripe Integration** - Secure payment processing
- 📅 **Advanced Booking System** - Real-time availability and date selection
- 🎯 **Admin Dashboard** - Lodge managers can track bookings and revenue
- 📧 **User Profiles** - Customers can manage their bookings and preferences
- 🌍 **Responsive Design** - Works seamlessly on all devices
- 🔍 **Search & Filter** - Find lodges by location and amenities
- ⭐ **Ratings & Reviews** - Customer feedback system

## Tech Stack

- **Frontend**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore & Realtime Database
- **Authentication**: Firebase Auth
- **Payments**: Stripe
- **State Management**: Zustand
- **Hosting**: Netlify (Frontend) + Firebase (Backend)
- **PWA**: Native service worker implementation

## Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account (free tier works)
- Stripe account (free tier works)
- Git

## Documentation

All documentation has been organized in the `/docs` folder for cleaner project structure:

| Document | Purpose |
|----------|---------|
| [START_HERE.md](docs/START_HERE.md) | ⭐ Begin here - complete overview |
| [QUICKSTART.md](docs/QUICKSTART.md) | 5-minute setup guide |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Step-by-step deployment to Netlify |
| [LODGE_URLS_QUICK_START.md](docs/LODGE_URLS_QUICK_START.md) | Implement lodge-specific URLs |
| [PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md) | Platform architecture |
| [SAMPLE_DATA.md](docs/SAMPLE_DATA.md) | Example test data |
| **[See all docs →](docs/)** | Complete documentation index |

## Project Structure

```
lodging-booking-app/
├── docs/                 # All documentation (14+ files)
│   ├── START_HERE.md
│   ├── QUICKSTART.md
│   ├── DEPLOYMENT.md
│   ├── LODGE_URLS_QUICK_START.md
│   └── ... (10+ more guides)
├── public/               # Static assets
│   ├── manifest.json     # PWA manifest
│   ├── sw.js             # Service worker
│   └── icons/            # App icons
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── stay/         # Lodge-specific URLs (NEW!)
│   │   ├── lodges/       # Lodge listing and details
│   │   ├── checkout/     # Booking checkout
│   │   ├── bookings/     # User bookings
│   │   ├── login/        # Authentication
│   │   ├── register/     # User registration
│   │   ├── profile/      # User profile
│   │   └── admin/        # Lodge manager dashboard
│   ├── components/       # React components
│   ├── config/
│   │   └── FIRESTORE_SCHEMA.md  # Database schema documentation
│   └── lib/              # Utilities and helpers
│       ├── firebase.ts   # Firebase config
│       ├── db.ts         # Database operations (30+ functions)
│       ├── auth.ts       # Authentication utilities
│       ├── store.ts      # Zustand state management
│       ├── types.ts      # TypeScript interfaces
│       └── stripe.ts     # Stripe utilities
└── configuration files
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lodging-booking-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database
3. Enable Realtime Database
4. Enable Firebase Storage
5. Enable Firebase Authentication (Email/Password)
6. Get your Firebase config from Project Settings

### 4. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# App Configuration
NEXT_PUBLIC_APP_NAME=Lodging Booking App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Creating Your First Lodge

### Database Schema Setup

The app uses Firestore with the following collections:

#### 1. `lodges` Collection

```javascript
{
  name: "Hotel Name",
  description: "Hotel description",
  address: "Street Address",
  city: "City",
  country: "Country",
  zipCode: "12345",
  latitude: 40.7128,
  longitude: -74.0060,
  imageUrl: "https://...",
  rating: 4.5,
  totalReviews: 120,
  amenities: ["WiFi", "Pool", "Restaurant"],
  ownerId: "owner_uid",
  isActive: true,
  contactEmail: "info@hotel.com",
  contactPhone: "+1234567890",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. `rooms` Collection

```javascript
{
  lodgeId: "lodge_id",
  name: "Deluxe Double Room",
  description: "Spacious room with...",
  roomType: "double",
  capacity: 2,
  basePrice: 120,
  currency: "USD",
  amenities: ["WiFi", "AC", "TV"],
  imageUrls: ["https://..."],
  totalRooms: 5,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 3. `bookings` Collection

```javascript
{
  userId: "user_uid",
  lodgeId: "lodge_id",
  roomId: "room_id",
  checkInDate: date,
  checkOutDate: date,
  numberOfGuests: 2,
  numberOfRooms: 1,
  totalPrice: 480,
  status: "confirmed",
  paymentStatus: "completed",
  specialRequests: "Early check-in if possible",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 4. `users` Collection

```javascript
{
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "https://...",
  role: "customer", // "customer", "lodge_manager", "admin"
  lodgeId: "lodge_id", // for lodge managers
  phoneNumber: "+1234567890",
  address: "123 Main St",
  city: "New York",
  country: "USA",
  zipCode: "10001",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 5. `reviews` Collection

```javascript
{
  lodgeId: "lodge_id",
  userId: "user_uid",
  rating: 5,
  comment: "Amazing experience!",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 6. `roomAvailability` Collection (Optional)

```javascript
{
  roomId: "room_id",
  date: "2024-12-25", // YYYY-MM-DD
  availableRooms: 3,
  price: 120
}
```

## Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Deploy to Netlify

1. **Connect GitHub Repository**
   - Push your code to GitHub
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Add Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   - Add all variables from `.env.local`

4. **Deploy**
   - Netlify will automatically build and deploy on push

### Deploy Firebase as Database Only

```bash
npm install -g firebase-tools
firebase login
firebase init
npm run build
```

## Making It Multi-Tenant

The application is designed to be multi-tenant from the ground up:

1. **Lodge Owners** can create and manage their own lodges
2. **Admin Users** can manage all lodges
3. **Customers** can book at any lodge

To convert a user to a lodge manager:

1. Create a user account
2. In Firestore, update the `users` collection document:
   ```javascript
   {
     role: "lodge_manager",
     lodgeId: "their_lodge_id"
   }
   ```
3. They can now access the admin dashboard

## Database Seeding (Sample Data)

To add sample data for testing:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore();

await addDoc(collection(db, "lodges"), {
  name: "Sunny Beach Resort",
  description: "A beautiful beachfront resort",
  address: "123 Beach Road",
  city: "Miami",
  country: "USA",
  zipCode: "33139",
  latitude: 25.7617,
  longitude: -80.1918,
  imageUrl: "https://example.com/hotel.jpg",
  rating: 4.5,
  totalReviews: 50,
  amenities: ["WiFi", "Pool", "Restaurant", "Beach Access"],
  ownerId: "owner_uid",
  isActive: true,
  contactEmail: "info@resort.com",
  contactPhone: "+1-305-555-0100",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## Adding PWA Icons

Replace placeholder icons in `public/` with your own:

- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `icon-192-maskable.png` (Maskable format)
- `icon-512-maskable.png` (Maskable format)
- `apple-touch-icon.png` (180x180)
- `favicon.ico`

## Customization

### Branding

Update `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your description",
};
```

Update `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Short Name",
  "theme_color": "#yourcolor"
}
```

### Colors & Styling

Tailwind is configured in `tailwind.config.ts`. Update colors as needed.

### Payment Methods

Stripe integration is basic for demo purposes. For production:
1. Implement full Stripe integration with webhook handling
2. Add more payment methods
3. Handle refunds and disputes

## Troubleshooting

### Firebase Errors
- Ensure all environment variables are correct
- Check Firestore rules allow reads/writes
- Verify Firebase project is properly configured

### Stripe Errors
- Use test API keys for development
- Check Stripe webhook configuration for production

### PWA Not Installing
- Check manifest.json is valid
- Ensure icons are in correct formats
- Test with Chrome DevTools

## Performance Optimization

- Images are optimized with Next.js Image component
- Service Worker provides offline caching
- Firestore is optimized with proper indexing
- Static pages are pre-rendered

## Security Considerations

1. **Never commit `.env.local`** to version control
2. **Use Firebase Security Rules** in production
3. **Enable CORS** appropriately
4. **Use HTTPS** for production deployment
5. **Validate inputs** on both client and server
6. **Implement rate limiting** for API calls

## Sample Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    match /lodges/{lodgeId} {
      allow read: if true;
      allow write: if request.auth.uid == resource.data.ownerId;
    }

    match /rooms/{roomId} {
      allow read: if true;
    }

    match /bookings/{bookingId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## License

MIT License - feel free to use this for commercial purposes

## Support

For issues and questions:
1. Check the documentation
2. Review Firebase and Stripe documentation
3. Create a GitHub issue with details

---

**Built with ❤️ for the travel industry**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
