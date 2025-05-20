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
    };

    fetchMuscleGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!user) {
      setError('You must be logged in to create an exercise');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: exerciseError } = await supabase
        .from('exercises')
        .insert({
          name,
          description,
          primary_muscle_group_id: primaryMuscleGroupId,
          secondary_muscle_group_id: secondaryMuscleGroupId || null
        });

      if (exerciseError) throw exerciseError;

      router.push('/dashboard/exercises');
    } catch (error) {
      console.error('Error creating exercise:', error);
      setError('Failed to create exercise. Please try again.');
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
        <h1 className="text-2xl font-bold">Create New Exercise</h1>
        <Link 
          href="/dashboard/exercises"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Exercises
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
              Exercise Name
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
            <label htmlFor="primaryMuscleGroup" className="block text-sm font-medium text-gray-700">
              Primary Muscle Group
            </label>
            <select
              id="primaryMuscleGroup"
              value={primaryMuscleGroupId}
              onChange={(e) => setPrimaryMuscleGroupId(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a muscle group</option>
              {muscleGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="secondaryMuscleGroup" className="block text-sm font-medium text-gray-700">
              Secondary Muscle Group (Optional)
            </label>
            <select
              id="secondaryMuscleGroup"
              value={secondaryMuscleGroupId}
              onChange={(e) => setSecondaryMuscleGroupId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a muscle group</option>
              {muscleGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Creating...' : 'Create Exercise'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 