'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🏨 LodgeBook
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/lodges" className="text-gray-700 hover:text-blue-600">
              Browse Lodges
            </Link>

            {user ? (
              <>
                <Link
                  href={user.role === 'lodge_manager' ? '/admin' : '/bookings'}
                  className="text-gray-700 hover:text-blue-600"
                >
                  {user.role === 'lodge_manager' ? 'Admin Dashboard' : 'My Bookings'}
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
