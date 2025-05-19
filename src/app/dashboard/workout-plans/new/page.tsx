'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface MuscleGroup {
  id: string;
  name: string;
}

interface MuscleTarget {
  muscle_group_id: string;
  exercises_target: number;
}

export default function NewWorkoutPlan() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [muscleTargets, setMuscleTargets] = useState<MuscleTarget[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalExercises = muscleTargets.reduce((sum, target) => sum + target.exercises_target, 0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      const { data, error } = await supabase
        .from('muscle_groups')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching muscle groups:', error);
        setError('Failed to load muscle groups. Please refresh the page.');
        return;
      }

      setMuscleGroups(data || []);
      // Initialize muscle targets with 0 exercises for each muscle group
      setMuscleTargets(data?.map(group => ({
        muscle_group_id: group.id,
        exercises_target: 0
      })) || []);
    };

    fetchMuscleGroups();
  }, []);

  const handleMuscleTargetChange = (muscleGroupId: string, value: number) => {
    setMuscleTargets(prev => 
      prev.map(target => 
        target.muscle_group_id === muscleGroupId 
          ? { ...target, exercises_target: value }
          : target
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!user) {
      setError('You must be logged in to create a workout plan');
      setIsSubmitting(false);
      return;
    }

    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error: ' + sessionError.message);
      }

      if (!session) {
        throw new Error('No active session found. Please log in again.');
      }

      console.log('Current session:', session);
      
      // Create workout plan
      const { data: workoutPlan, error: workoutPlanError } = await supabase
        .from('workout_plans')
        .insert({
          name,
          description,
          status: 'draft',
          total_exercises_planned: totalExercises,
          user_id: session.user.id
        })
        .select()
        .single();

      if (workoutPlanError) {
        console.error('Workout plan creation error:', workoutPlanError);
        throw new Error(`Failed to create workout plan: ${workoutPlanError.message}`);
      }

      if (!workoutPlan) {
        throw new Error('Failed to create workout plan: No data returned');
      }

      console.log('Created workout plan:', workoutPlan);

      // Create muscle targets
      const muscleTargetsToInsert = muscleTargets
        .filter(target => target.exercises_target > 0)
        .map(target => ({
          workout_plan_id: workoutPlan.id,
          muscle_group_id: target.muscle_group_id,
          exercises_target: target.exercises_target
        }));

      if (muscleTargetsToInsert.length > 0) {
        const { error: muscleTargetsError } = await supabase
          .from('workout_plan_muscle_targets')
          .insert(muscleTargetsToInsert);

        if (muscleTargetsError) {
          console.error('Muscle targets creation error:', muscleTargetsError);
          throw new Error(`Failed to create muscle targets: ${muscleTargetsError.message}`);
        }
      }

      router.push('/dashboard/workout-plans');
    } catch (error) {
      console.error('Error creating workout plan:', error);
      setError(error instanceof Error ? error.message : 'Failed to create workout plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
        <h1 className="text-2xl font-bold">Create New Workout Plan</h1>
        <Link 
          href="/dashboard/workout-plans"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Workout Plans
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full">
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Workout Plan Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Muscle Group Targets</h2>
              <div className="text-sm font-medium text-gray-700">
                Total Exercises: <span className="text-blue-600">{totalExercises}</span>
              </div>
            </div>
            <div className="space-y-4">
              {muscleGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between">
                  <label htmlFor={`target-${group.id}`} className="block text-sm font-medium text-gray-700">
                    {group.name}
                  </label>
                  <input
                    type="number"
                    id={`target-${group.id}`}
                    min="0"
                    value={muscleTargets.find(t => t.muscle_group_id === group.id)?.exercises_target || 0}
                    onChange={(e) => handleMuscleTargetChange(group.id, parseInt(e.target.value) || 0)}
                    className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Creating...' : 'Create Workout Plan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 