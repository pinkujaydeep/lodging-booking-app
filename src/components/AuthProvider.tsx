'use client';

import { useEffect } from 'react';
import { initializeAuth } from '@/lib/auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
