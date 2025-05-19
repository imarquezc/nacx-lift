'use client';

import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    router.push('/dashboard');
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            nacx lift
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Your personal fitness companion
          </p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#3b82f6',
                  brandAccent: '#2563eb',
                },
              },
            },
            className: {
              container: 'w-full',
              button: 'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors',
              input: 'w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            },
          }}
          providers={['google', 'github']}
          redirectTo={`${window.location.origin}/dashboard`}
        />
      </div>
    </main>
  );
}