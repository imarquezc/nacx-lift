'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

interface WorkoutPlan {
  id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'completed' | 'archived';
  total_exercises_planned: number;
  created_at: string;
}

export default function WorkoutPlans() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workout plans:', error);
        return;
      }

      setWorkoutPlans(data || []);
      setIsLoadingPlans(false);
    };

    if (user) {
      fetchWorkoutPlans();
    }
  }, [supabase, user]);

  if (isLoading || isLoadingPlans) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Workout Plans</h1>
        <div className="space-x-4">
          <Link 
            href="/dashboard/workout-plans/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create New Plan
          </Link>
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workoutPlans.map((plan) => (
          <div key={plan.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            {plan.description && (
              <p className="text-gray-600 mb-4">{plan.description}</p>
            )}
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Status: <span className="font-medium capitalize">{plan.status}</span>
              </p>
              <p className="text-sm text-gray-500">
                Total Exercises: <span className="font-medium">{plan.total_exercises_planned}</span>
              </p>
              <p className="text-sm text-gray-500">
                Created: <span className="font-medium">
                  {new Date(plan.created_at).toLocaleDateString()}
                </span>
              </p>
            </div>
            <div className="mt-4">
              <Link
                href={`/dashboard/workout-plans/${plan.id}`}
                className="text-blue-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {workoutPlans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No workout plans yet</p>
          <Link
            href="/dashboard/workout-plans/new"
            className="text-blue-600 hover:underline"
          >
            Create your first workout plan
          </Link>
        </div>
      )}
    </div>
  );
} 