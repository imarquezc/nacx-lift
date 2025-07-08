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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="font-semibold text-slate-900">Nacx Lift</span>
              </Link>
              <span className="text-slate-400">/</span>
              <Link href="/dashboard/workout-plans" className="text-slate-600 hover:text-slate-900 transition-colors">
                Workout Plans
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-900 font-medium">New Plan</span>
            </div>
            <Link 
              href="/dashboard/workout-plans"
              className="hidden sm:block px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              Back to Plans
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            Create New Workout Plan
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Design a balanced workout routine by setting target exercise counts for each muscle group.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl" role="alert">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-3">
                Workout Plan Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full rounded-xl border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors text-lg px-4 py-3"
                placeholder="e.g., Summer Cut, Strength Building, Full Body"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-3">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="block w-full rounded-xl border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors px-4 py-3"
                placeholder="Describe your workout goals, schedule, or any notes about this plan..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Muscle Group Targets</h2>
                  <p className="text-sm text-slate-600 mt-1">Set target exercise counts for each muscle group</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Total Exercises</div>
                  <div className="text-2xl font-bold text-blue-600">{totalExercises}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {muscleGroups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <label htmlFor={`target-${group.id}`} className="block text-sm font-medium text-slate-700">
                      {group.name}
                    </label>
                    <input
                      type="number"
                      id={`target-${group.id}`}
                      min="0"
                      value={muscleTargets.find(t => t.muscle_group_id === group.id)?.exercises_target || 0}
                      onChange={(e) => handleMuscleTargetChange(group.id, parseInt(e.target.value) || 0)}
                      className="block w-20 rounded-lg border-slate-300 bg-white text-slate-900 text-center shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard/workout-plans"
                  className="flex-1 px-6 py-3 text-center border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || totalExercises === 0}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Plan...
                    </div>
                  ) : 'Create Workout Plan'}
                </button>
              </div>
              {totalExercises === 0 && (
                <p className="text-xs text-slate-500 text-center mt-3">
                  Add at least one exercise target to create your plan
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 