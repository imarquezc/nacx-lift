'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Dashboard() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="flex min-h-screen flex-col p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={async () => {
            await signOut();
            router.push('/');
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link 
          href="/dashboard/workout-plans"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Workout Plans</h2>
          <p className="text-gray-600">
            Create and manage your workout plans. Set targets for different muscle groups and track your progress.
          </p>
        </Link>
        
        {/* Add more dashboard cards here as needed */}
      </div>
      
      <div className="mt-6">
        <Link 
          href="/" 
          className="text-blue-600 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}