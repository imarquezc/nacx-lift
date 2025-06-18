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

export default function NewExercise() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [primaryMuscleGroupId, setPrimaryMuscleGroupId] = useState('');
  const [secondaryMuscleGroupId, setSecondaryMuscleGroupId] = useState('');
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingExercises, setExistingExercises] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch muscle groups
      const { data: muscleData, error: muscleError } = await supabase
        .from('muscle_groups')
        .select('*')
        .order('name');

      if (muscleError) {
        console.error('Error fetching muscle groups:', muscleError);
        setError('Failed to load muscle groups. Please refresh the page.');
        return;
      }

      setMuscleGroups(muscleData || []);

      // Fetch existing exercise names for validation
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('exercises')
        .select('name');

      if (exerciseError) {
        console.error('Error fetching exercises:', exerciseError);
        return;
      }

      setExistingExercises(exerciseData?.map(e => e.name.toLowerCase()) || []);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Check for uniqueness
    if (existingExercises.includes(name.toLowerCase().trim())) {
      setError('An exercise with this name already exists. Please choose a different name.');
      setIsSubmitting(false);
      return;
    }

    if (!user) {
      setError('You must be logged in to create an exercise');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: exerciseError } = await supabase
        .from('exercises')
        .insert({
          name: name.trim(),
          description: description.trim(),
          primary_muscle_group_id: primaryMuscleGroupId,
          secondary_muscle_group_id: secondaryMuscleGroupId || null
        });

      if (exerciseError) {
        if (exerciseError.code === '23505') { // Unique constraint violation
          setError('An exercise with this name already exists. Please choose a different name.');
        } else {
          throw exerciseError;
        }
        return;
      }

      router.push('/dashboard/workout-plans');
    } catch (error) {
      console.error('Error creating exercise:', error);
      setError('Failed to create exercise. Please try again.');
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
              <span className="text-slate-600">New Exercise</span>
            </div>
            <Link 
              href="/dashboard/workout-plans"
              className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
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
            Create New Exercise
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Add a new exercise to the community library. Make it available for all users to include in their workout plans.
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
                Exercise Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full rounded-xl border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors text-lg px-4 py-3"
                placeholder="e.g., Bench Press, Squat, Deadlift"
              />
              {name && existingExercises.includes(name.toLowerCase().trim()) ? (
                <div className="mt-2 flex items-center text-red-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">This exercise name already exists</span>
                </div>
              ) : name && (
                <div className="mt-2 flex items-center text-emerald-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Name available</span>
                </div>
              )}
              <p className="mt-2 text-xs text-slate-500">Must be unique across all exercises in the library</p>
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
                placeholder="Describe how to perform this exercise, any tips, or important form cues..."
              />
              <p className="mt-2 text-xs text-slate-500">Help other users understand how to perform this exercise correctly</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="primaryMuscleGroup" className="block text-sm font-medium text-slate-700 mb-3">
                  Primary Muscle Group <span className="text-red-500">*</span>
                </label>
                <select
                  id="primaryMuscleGroup"
                  value={primaryMuscleGroupId}
                  onChange={(e) => setPrimaryMuscleGroupId(e.target.value)}
                  required
                  className="block w-full rounded-xl border-slate-300 bg-white text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors px-4 py-3"
                >
                  <option value="">Select primary muscle</option>
                  {muscleGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-500">The main muscle group this exercise targets</p>
              </div>

              <div>
                <label htmlFor="secondaryMuscleGroup" className="block text-sm font-medium text-slate-700 mb-3">
                  Secondary Muscle Group
                </label>
                <select
                  id="secondaryMuscleGroup"
                  value={secondaryMuscleGroupId}
                  onChange={(e) => setSecondaryMuscleGroupId(e.target.value)}
                  className="block w-full rounded-xl border-slate-300 bg-white text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors px-4 py-3"
                >
                  <option value="">Select secondary muscle</option>
                  {muscleGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-500">Additional muscle group worked (optional)</p>
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
                  disabled={isSubmitting || (name && existingExercises.includes(name.toLowerCase().trim()))}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Exercise...
                    </div>
                  ) : 'Create Exercise'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 