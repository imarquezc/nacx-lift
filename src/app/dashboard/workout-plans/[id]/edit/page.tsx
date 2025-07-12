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
  id?: string;
  muscle_group_id: string;
  exercises_target: number;
  muscle_group?: MuscleGroup;
}

interface WorkoutPlanEditProps {
  params: Promise<{ id: string }>;
}

export default function WorkoutPlanEdit({ params }: WorkoutPlanEditProps) {
  const [id, setId] = useState<string>('');
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [muscleTargets, setMuscleTargets] = useState<MuscleTarget[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) return;

      try {
        // Fetch workout plan
        const { data: plan, error: planError } = await supabase
          .from('workout_plans')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (planError) throw planError;
        
        setName(plan.name);
        setDescription(plan.description || '');

        // Fetch muscle groups
        const { data: groups, error: groupsError } = await supabase
          .from('muscle_groups')
          .select('*')
          .order('name');

        if (groupsError) throw groupsError;

        // Fetch existing muscle targets
        const { data: targets, error: targetsError } = await supabase
          .from('workout_plan_muscle_targets')
          .select(`
            *,
            muscle_group:muscle_groups(*)
          `)
          .eq('workout_plan_id', id);

        if (targetsError) throw targetsError;
        
        // Create a map of all muscle groups with their targets
        const targetMap = new Map(targets.map(t => [t.muscle_group_id, t]));
        const allTargets = groups.map(group => {
          const existing = targetMap.get(group.id);
          return existing || {
            muscle_group_id: group.id,
            exercises_target: 0,
            muscle_group: group
          };
        });
        
        setMuscleTargets(allTargets);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load workout plan. Please try again.');
      }
    };

    fetchData();
  }, [id, user]);

  const handleTargetChange = (muscleGroupId: string, value: number) => {
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
    
    if (!user || !id) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Update workout plan
      const totalExercises = muscleTargets.reduce((sum, target) => sum + target.exercises_target, 0);
      
      const { error: updateError } = await supabase
        .from('workout_plans')
        .update({
          name: name.trim(),
          description: description.trim() || null,
          total_exercises_planned: totalExercises,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Delete existing muscle targets
      const { error: deleteError } = await supabase
        .from('workout_plan_muscle_targets')
        .delete()
        .eq('workout_plan_id', id);

      if (deleteError) throw deleteError;

      // Insert new muscle targets (only those with target > 0)
      const targetsToInsert = muscleTargets
        .filter(target => target.exercises_target > 0)
        .map(target => ({
          workout_plan_id: id,
          muscle_group_id: target.muscle_group_id,
          exercises_target: target.exercises_target
        }));

      if (targetsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('workout_plan_muscle_targets')
          .insert(targetsToInsert);

        if (insertError) throw insertError;
      }

      router.push(`/dashboard/workout-plans/${id}`);
    } catch (error) {
      console.error('Error updating workout plan:', error);
      setError('Failed to update workout plan. Please try again.');
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
            </div>
            <Link 
              href={`/dashboard/workout-plans/${id}`}
              className="hidden sm:block px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              Cancel
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Edit Workout Plan</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Plan Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors"
                  placeholder="e.g., Summer Strength Program"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="block w-full rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors"
                  placeholder="Describe your workout plan goals..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Muscle Group Targets</h2>
            <p className="text-sm text-slate-600 mb-6">Set exercise targets for each muscle group</p>
            
            <div className="space-y-4">
              {muscleTargets.map((target) => (
                <div key={target.muscle_group_id} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-900">
                    {target.muscle_group?.name}
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleTargetChange(target.muscle_group_id, Math.max(0, target.exercises_target - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={target.exercises_target}
                      onChange={(e) => handleTargetChange(target.muscle_group_id, Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-16 text-center rounded-lg border-slate-300 bg-white text-slate-900"
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => handleTargetChange(target.muscle_group_id, target.exercises_target + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href={`/dashboard/workout-plans/${id}`}
              className="flex-1 px-6 py-3 text-center text-slate-700 bg-slate-100 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </div>
              ) : 'Update Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}