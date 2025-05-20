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

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  status: string;
  total_exercises_planned: number;
  started_at: string;
  completed_at: string | null;
}

interface MuscleTarget {
  id: string;
  muscle_group_id: string;
  exercises_target: number;
  muscle_group: MuscleGroup;
}

interface Exercise {
  id: string;
  name: string;
  primary_muscle_group_id: string;
  secondary_muscle_group_id: string | null;
  description: string | null;
}

interface ExerciseExecution {
  id: string;
  exercise_id: string;
  executed_at: string;
  sets: number;
  reps: number;
  weight_kg: number;
  location: string | null;
  notes: string | null;
  completed: boolean;
  exercise: Exercise;
}

interface ExerciseExecutionForm {
  sets: number;
  reps: number;
  weight_kg: number;
  location: string;
  notes: string;
  completed: boolean;
}

export default function WorkoutPlanShow({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [muscleTargets, setMuscleTargets] = useState<MuscleTarget[]>([]);
  const [exerciseExecutions, setExerciseExecutions] = useState<ExerciseExecution[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingExecution, setEditingExecution] = useState<string | null>(null);
  const [executionForm, setExecutionForm] = useState<ExerciseExecutionForm>({
    sets: 0,
    reps: 0,
    weight_kg: 0,
    location: '',
    notes: '',
    completed: false
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchWorkoutPlanData = async () => {
      try {
        // Fetch workout plan
        const { data: plan, error: planError } = await supabase
          .from('workout_plans')
          .select('*')
          .eq('id', params.id)
          .single();

        if (planError) throw planError;
        setWorkoutPlan(plan);

        // Fetch muscle targets with muscle group info
        const { data: targets, error: targetsError } = await supabase
          .from('workout_plan_muscle_targets')
          .select(`
            *,
            muscle_group:muscle_groups(*)
          `)
          .eq('workout_plan_id', params.id);

        if (targetsError) throw targetsError;
        setMuscleTargets(targets);

        // Fetch exercise executions with exercise info
        const { data: executions, error: executionsError } = await supabase
          .from('exercise_executions')
          .select(`
            *,
            exercise:exercises(*)
          `)
          .eq('workout_plan_id', params.id)
          .order('executed_at', { ascending: false });

        if (executionsError) throw executionsError;
        setExerciseExecutions(executions);

        // Fetch available exercises
        const { data: exercises, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .order('name');

        if (exercisesError) throw exercisesError;
        setAvailableExercises(exercises);
      } catch (error) {
        console.error('Error fetching workout plan data:', error);
        setError('Failed to load workout plan data. Please refresh the page.');
      }
    };

    if (params.id) {
      fetchWorkoutPlanData();
    }
  }, [params.id]);

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExercise) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: executionError } = await supabase
        .from('exercise_executions')
        .insert({
          workout_plan_id: params.id,
          exercise_id: selectedExercise,
          executed_at: new Date().toISOString(),
          completed: false
        });

      if (executionError) throw executionError;

      // Refresh exercise executions
      const { data: executions, error: executionsError } = await supabase
        .from('exercise_executions')
        .select(`
          *,
          exercise:exercises(*)
        `)
        .eq('workout_plan_id', params.id)
        .order('executed_at', { ascending: false });

      if (executionsError) throw executionsError;
      setExerciseExecutions(executions);
      setSelectedExercise('');
    } catch (error) {
      console.error('Error adding exercise:', error);
      setError('Failed to add exercise. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecutionUpdate = async (executionId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('exercise_executions')
        .update({
          sets: executionForm.sets,
          reps: executionForm.reps,
          weight_kg: executionForm.weight_kg,
          location: executionForm.location || null,
          notes: executionForm.notes || null,
          completed: executionForm.completed
        })
        .eq('id', executionId);

      if (updateError) throw updateError;

      // Refresh exercise executions
      const { data: executions, error: executionsError } = await supabase
        .from('exercise_executions')
        .select(`
          *,
          exercise:exercises(*)
        `)
        .eq('workout_plan_id', params.id)
        .order('executed_at', { ascending: false });

      if (executionsError) throw executionsError;
      setExerciseExecutions(executions);
      setEditingExecution(null);
    } catch (error) {
      console.error('Error updating exercise execution:', error);
      setError('Failed to update exercise. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (execution: ExerciseExecution) => {
    setEditingExecution(execution.id);
    setExecutionForm({
      sets: execution.sets || 0,
      reps: execution.reps || 0,
      weight_kg: execution.weight_kg || 0,
      location: execution.location || '',
      notes: execution.notes || '',
      completed: execution.completed
    });
  };

  const getMuscleGroupProgress = (muscleGroupId: string) => {
    const target = muscleTargets.find(t => t.muscle_group_id === muscleGroupId);
    const completed = exerciseExecutions.filter(e => 
      e.exercise.primary_muscle_group_id === muscleGroupId && e.completed
    ).length;
    
    return {
      target: target?.exercises_target || 0,
      completed
    };
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user || !workoutPlan) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">{workoutPlan.name}</h1>
          {workoutPlan.description && (
            <p className="text-gray-600 mt-2">{workoutPlan.description}</p>
          )}
        </div>
        <Link 
          href="/dashboard/workout-plans"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Workout Plans
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Muscle Group Progress */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Muscle Group Progress</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="space-y-4">
            {muscleTargets.map((target) => {
              const progress = getMuscleGroupProgress(target.muscle_group_id);
              return (
                <div key={target.id} className="flex items-center justify-between">
                  <span className="font-medium">{target.muscle_group.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {progress.completed} / {progress.target}
                    </span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${(progress.completed / progress.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Exercise Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add Exercise</h2>
            <Link
              href="/dashboard/exercises/new"
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create New Exercise
            </Link>
          </div>
          <form onSubmit={handleAddExercise} className="space-y-4">
            <div>
              <label htmlFor="exercise" className="block text-sm font-medium text-gray-700">
                Select Exercise
              </label>
              <select
                id="exercise"
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select an exercise</option>
                {availableExercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Adding...' : 'Add Exercise'}
            </button>
          </form>
        </div>
      </div>

      {/* Exercise History */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Exercise History</h2>
        <div className="space-y-4">
          {exerciseExecutions.map((execution) => (
            <div key={execution.id} className="border-b pb-4 last:border-b-0">
              {editingExecution === execution.id ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleExecutionUpdate(execution.id);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`sets-${execution.id}`} className="block text-sm font-medium text-gray-700">
                        Sets
                      </label>
                      <input
                        type="number"
                        id={`sets-${execution.id}`}
                        min="0"
                        value={executionForm.sets}
                        onChange={(e) => setExecutionForm(prev => ({ ...prev, sets: parseInt(e.target.value) || 0 }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={`reps-${execution.id}`} className="block text-sm font-medium text-gray-700">
                        Reps
                      </label>
                      <input
                        type="number"
                        id={`reps-${execution.id}`}
                        min="0"
                        value={executionForm.reps}
                        onChange={(e) => setExecutionForm(prev => ({ ...prev, reps: parseInt(e.target.value) || 0 }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={`weight-${execution.id}`} className="block text-sm font-medium text-gray-700">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        id={`weight-${execution.id}`}
                        min="0"
                        value={executionForm.weight_kg}
                        onChange={(e) => setExecutionForm(prev => ({ ...prev, weight_kg: parseInt(e.target.value) || 0 }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={`location-${execution.id}`} className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        id={`location-${execution.id}`}
                        value={executionForm.location}
                        onChange={(e) => setExecutionForm(prev => ({ ...prev, location: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Home, Gym"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`notes-${execution.id}`} className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id={`notes-${execution.id}`}
                      value={executionForm.notes}
                      onChange={(e) => setExecutionForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Add any notes about your workout..."
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={executionForm.completed}
                        onChange={(e) => setExecutionForm(prev => ({ ...prev, completed: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Mark as completed</span>
                    </label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingExecution(null)}
                      className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{execution.exercise.name}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(execution.executed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        execution.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {execution.completed ? 'Completed' : 'Pending'}
                      </span>
                      <button
                        onClick={() => startEditing(execution)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  {execution.sets > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {execution.sets} sets × {execution.reps} reps
                      {execution.weight_kg > 0 && ` @ ${execution.weight_kg}kg`}
                    </p>
                  )}
                  {execution.location && (
                    <p className="text-sm text-gray-600">
                      Location: {execution.location}
                    </p>
                  )}
                  {execution.notes && (
                    <p className="text-sm text-gray-600 mt-1">{execution.notes}</p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 