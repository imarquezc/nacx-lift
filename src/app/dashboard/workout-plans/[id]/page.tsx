'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ExerciseAutocomplete from '@/components/ExerciseAutocomplete';
import GymNumberInput from '@/components/GymNumberInput';
import WeightSlider from '@/components/WeightSlider';

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
  description?: string;
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
}

interface WorkoutPlanShowProps {
  params: Promise<{ id: string }>;
}

export default function WorkoutPlanShow({ params }: WorkoutPlanShowProps) {
  const [id, setId] = useState<string>('');
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
  const [isCreatingNewExercise, setIsCreatingNewExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDescription, setNewExerciseDescription] = useState('');
  const [newExercisePrimaryMuscle, setNewExercisePrimaryMuscle] = useState('');
  const [newExerciseSecondaryMuscle, setNewExerciseSecondaryMuscle] = useState('');
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [executionForm, setExecutionForm] = useState<ExerciseExecutionForm>({
    sets: 4,
    reps: 8,
    weight_kg: 30,
    location: '',
    notes: ''
  });

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
    const fetchWorkoutPlanData = async () => {
      try {
        // Fetch workout plan
        const { data: plan, error: planError } = await supabase
          .from('workout_plans')
          .select('*')
          .eq('id', id)
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
          .eq('workout_plan_id', id);

        if (targetsError) throw targetsError;
        setMuscleTargets(targets);

        // Fetch exercise executions with exercise info
        const { data: executions, error: executionsError } = await supabase
          .from('exercise_executions')
          .select(`
            *,
            exercise:exercises(*)
          `)
          .eq('workout_plan_id', id)
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

    if (id) {
      fetchWorkoutPlanData();
    }
  }, [id]);

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);

    let exerciseId = selectedExercise;

    try {
      // If creating a new exercise
      if (isCreatingNewExercise) {
        if (!newExerciseName.trim() || !newExercisePrimaryMuscle) {
          setError('Please fill in all required fields');
          setIsSubmitting(false);
          return;
        }

        // Check if exercise name already exists
        const { data: existingExercise } = await supabase
          .from('exercises')
          .select('id')
          .eq('name', newExerciseName.trim())
          .single();

        if (existingExercise) {
          setError('An exercise with this name already exists. Please use the existing one or choose a different name.');
          setIsSubmitting(false);
          return;
        }

        // Create new exercise
        const { data: newExercise, error: createError } = await supabase
          .from('exercises')
          .insert({
            name: newExerciseName.trim(),
            description: newExerciseDescription.trim() || null,
            primary_muscle_group_id: newExercisePrimaryMuscle,
            secondary_muscle_group_id: newExerciseSecondaryMuscle || null
          })
          .select()
          .single();

        if (createError) {
          if (createError.code === '23505') {
            setError('An exercise with this name already exists.');
          } else {
            throw createError;
          }
          return;
        }

        exerciseId = newExercise.id;
        
        // Add to available exercises
        setAvailableExercises([...availableExercises, newExercise]);
      } else {
        // Using existing exercise
        if (!selectedExercise) {
          setError('Please select an exercise');
          setIsSubmitting(false);
          return;
        }
      }

      // Add exercise execution with initial values
      const { error: executionError } = await supabase
        .from('exercise_executions')
        .insert({
          workout_plan_id: id,
          exercise_id: exerciseId,
          executed_at: new Date().toISOString(),
          sets: executionForm.sets || null,
          reps: executionForm.reps || null,
          weight_kg: executionForm.weight_kg || null,
          location: executionForm.location || null,
          notes: executionForm.notes || null,
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
        .eq('workout_plan_id', id)
        .order('executed_at', { ascending: false });

      if (executionsError) throw executionsError;
      setExerciseExecutions(executions);
      
      // Reset form
      setSelectedExercise('');
      setNewExerciseName('');
      setNewExerciseDescription('');
      setNewExercisePrimaryMuscle('');
      setNewExerciseSecondaryMuscle('');
      setIsCreatingNewExercise(false);
      setIsAddingExercise(false);
      setExecutionForm({
        sets: 4,
        reps: 8,
        weight_kg: 30,
        location: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding exercise:', error);
      setError('Failed to add exercise. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleCompleted = async (executionId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('exercise_executions')
        .update({ completed: !currentStatus })
        .eq('id', executionId);

      if (error) throw error;

      // Update local state
      setExerciseExecutions(prev => 
        prev.map(ex => 
          ex.id === executionId 
            ? { ...ex, completed: !currentStatus }
            : ex
        )
      );
    } catch (error) {
      console.error('Error toggling completion status:', error);
      setError('Failed to update completion status');
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
          notes: executionForm.notes || null
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
        .eq('workout_plan_id', id)
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
      notes: execution.notes || ''
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading workout plan...</p>
        </div>
      </div>
    );
  }

  if (!user || !workoutPlan) {
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
              <span className="text-slate-900 font-medium truncate max-w-32">{workoutPlan.name}</span>
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

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{workoutPlan.name}</h1>
          {workoutPlan.description && (
            <p className="text-lg text-slate-600">{workoutPlan.description}</p>
          )}
        </div>

        {/* Overall Progress */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200 mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-slate-900">Overall Workout Progress</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">
                {exerciseExecutions.filter(e => e.completed).length} / {muscleTargets.reduce((acc, target) => acc + target.exercises_target, 0)} completed
              </span>
              <span className="text-sm font-bold text-blue-600">
                {Math.round(
                  muscleTargets.reduce((acc, target) => acc + target.exercises_target, 0) > 0
                    ? (exerciseExecutions.filter(e => e.completed).length / muscleTargets.reduce((acc, target) => acc + target.exercises_target, 0)) * 100
                    : 0
                )}%
              </span>
            </div>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
              style={{ 
                width: `${Math.min(
                  muscleTargets.reduce((acc, target) => acc + target.exercises_target, 0) > 0
                    ? (exerciseExecutions.filter(e => e.completed).length / muscleTargets.reduce((acc, target) => acc + target.exercises_target, 0)) * 100
                    : 0, 
                  100
                )}%` 
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Muscle Group Progress */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Muscle Group Breakdown</h2>
            </div>
            <div className="space-y-6">
              {muscleTargets.map((target) => {
                const progress = getMuscleGroupProgress(target.muscle_group_id);
                const percentage = (progress.completed / progress.target) * 100;
                return (
                  <div key={target.id} className="">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{target.muscle_group.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600">
                          {progress.completed} / {progress.target}
                        </span>
                        <span className="text-xs text-slate-500">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Exercise History & Add New */}
        <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Exercises</h2>
            <button
              onClick={() => setIsAddingExercise(!isAddingExercise)}
              className={`px-4 py-2 font-medium rounded-lg touch-manipulation ${
                isAddingExercise 
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {isAddingExercise ? 'Cancel' : 'Add Exercise'}
            </button>
          </div>

          {/* Add New Exercise Form */}
          {isAddingExercise && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-blue-100">
              <form onSubmit={handleAddExercise} className="space-y-6">
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

                {/* Exercise Selection */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold text-slate-700">Select Exercise</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNewExercise(!isCreatingNewExercise);
                        setError(null);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {isCreatingNewExercise ? 'Select from library' : 'Create new exercise'}
                    </button>
                  </div>
                  
                  {!isCreatingNewExercise ? (
                    <ExerciseAutocomplete
                      exercises={availableExercises}
                      value={selectedExercise}
                      onChange={async (exerciseId) => {
                        setSelectedExercise(exerciseId);
                        if (exerciseId) {
                          // Fetch last execution for this exercise
                          const { data: lastExecution } = await supabase
                            .from('exercise_executions')
                            .select('sets, reps, weight_kg')
                            .eq('exercise_id', exerciseId)
                            .eq('user_id', user.id)
                            .order('executed_at', { ascending: false })
                            .limit(1)
                            .single();
                          
                          if (lastExecution) {
                            setExecutionForm(prev => ({
                              ...prev,
                              sets: lastExecution.sets || 4,
                              reps: lastExecution.reps || 8,
                              weight_kg: lastExecution.weight_kg || 30
                            }));
                          }
                        }
                      }}
                      placeholder="Type to search exercises..."
                    />
                  ) : (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={newExerciseName}
                        onChange={(e) => setNewExerciseName(e.target.value)}
                        className="w-full px-4 py-3 text-lg rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-0 focus:outline-none"
                        placeholder="Exercise name (e.g., Bench Press)"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={newExercisePrimaryMuscle}
                          onChange={(e) => setNewExercisePrimaryMuscle(e.target.value)}
                          className="px-4 py-3 rounded-lg border-slate-300 bg-white text-slate-900"
                          required
                        >
                          <option value="">Primary muscle</option>
                          {muscleTargets.map((target) => (
                            <option key={target.muscle_group.id} value={target.muscle_group.id}>
                              {target.muscle_group.name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={newExerciseSecondaryMuscle}
                          onChange={(e) => setNewExerciseSecondaryMuscle(e.target.value)}
                          className="px-4 py-3 rounded-lg border-slate-300 bg-white text-slate-900"
                        >
                          <option value="">Secondary muscle</option>
                          {muscleTargets.map((target) => (
                            <option key={target.muscle_group.id} value={target.muscle_group.id}>
                              {target.muscle_group.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Exercise Details */}
                <div className="bg-white rounded-xl p-4 md:p-6 space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <GymNumberInput
                      value={executionForm.sets}
                      onChange={(value) => setExecutionForm(prev => ({ ...prev, sets: value }))}
                      label="Sets"
                      min={0}
                      max={50}
                    />
                    <GymNumberInput
                      value={executionForm.reps}
                      onChange={(value) => setExecutionForm(prev => ({ ...prev, reps: value }))}
                      label="Reps"
                      min={0}
                      max={100}
                    />
                  </div>
                  <WeightSlider
                    value={executionForm.weight_kg}
                    onChange={(value) => setExecutionForm(prev => ({ ...prev, weight_kg: value }))}
                    min={0}
                    max={200}
                    step={2.5}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-medium text-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed active:bg-blue-800 touch-manipulation"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding...
                    </div>
                  ) : 'Add Exercise'}
                </button>
              </form>
            </div>
          )}

          {/* Exercise List */}
          <div className="space-y-6">
            {exerciseExecutions.length === 0 && !isAddingExercise ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No exercises yet</h3>
                <p className="text-slate-600">Add your first exercise to start tracking your progress.</p>
              </div>
            ) : (
              exerciseExecutions.map((execution) => (
                <div key={execution.id} className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
                  {editingExecution === execution.id ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleExecutionUpdate(execution.id);
                      }}
                      className="space-y-8"
                    >
                      <div className="bg-slate-50 rounded-2xl p-4 md:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                          <GymNumberInput
                            value={executionForm.sets}
                            onChange={(value) => setExecutionForm(prev => ({ ...prev, sets: value }))}
                            label="Sets"
                            min={0}
                            max={50}
                          />
                          <GymNumberInput
                            value={executionForm.reps}
                            onChange={(value) => setExecutionForm(prev => ({ ...prev, reps: value }))}
                            label="Reps"
                            min={0}
                            max={100}
                          />
                        </div>
                        <WeightSlider
                          value={executionForm.weight_kg}
                          onChange={(value) => setExecutionForm(prev => ({ ...prev, weight_kg: value }))}
                          min={0}
                          max={200}
                          step={2.5}
                        />
                      </div>
                      <div className="space-y-4">
                        <details className="group">
                          <summary className="cursor-pointer list-none">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                              <span className="text-sm font-medium text-slate-600">Additional Details (Optional)</span>
                              <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </summary>
                          <div className="mt-4 space-y-4">
                            <div>
                              <label htmlFor={`location-${execution.id}`} className="block text-sm font-medium text-slate-700 mb-2">
                                Location
                              </label>
                              <input
                                type="text"
                                id={`location-${execution.id}`}
                                value={executionForm.location}
                                onChange={(e) => setExecutionForm(prev => ({ ...prev, location: e.target.value }))}
                                className="block w-full rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors"
                                placeholder="e.g., Home, Gym"
                              />
                            </div>
                            <div>
                              <label htmlFor={`notes-${execution.id}`} className="block text-sm font-medium text-slate-700 mb-2">
                                Notes
                              </label>
                              <textarea
                                id={`notes-${execution.id}`}
                                value={executionForm.notes}
                                onChange={(e) => setExecutionForm(prev => ({ ...prev, notes: e.target.value }))}
                                rows={3}
                                className="block w-full rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors"
                                placeholder="Add any notes about your workout..."
                              />
                            </div>
                          </div>
                        </details>
                      </div>
                      <div className="flex gap-4 pt-6">
                        <button
                          type="button"
                          onClick={() => setEditingExecution(null)}
                          className="flex-1 px-6 py-4 text-lg font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 active:bg-slate-300 touch-manipulation"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 px-6 py-4 text-lg font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed active:bg-blue-800 touch-manipulation"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Saving...
                            </div>
                          ) : 'Save Workout'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{execution.exercise.name}</h3>
                          <p className="text-sm text-slate-500">
                            {new Date(execution.executed_at).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={execution.completed}
                            onChange={() => handleToggleCompleted(execution.id, execution.completed)}
                            className="w-5 h-5 rounded border-2 border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            execution.completed 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {execution.completed ? 'Completed' : 'Pending'}
                          </span>
                          <button
                            onClick={() => startEditing(execution)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {execution.sets > 0 && (
                          <div className="flex items-center text-sm text-slate-600">
                            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <strong>{execution.sets}</strong> sets × <strong>{execution.reps}</strong> reps
                            {execution.weight_kg > 0 && (
                              <>
                                {' @ '}<strong>{execution.weight_kg}kg</strong>
                              </>
                            )}
                          </div>
                        )}
                        {execution.location && (
                          <div className="flex items-center text-sm text-slate-600">
                            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {execution.location}
                          </div>
                        )}
                        {execution.notes && (
                          <div className="flex items-start text-sm text-slate-600">
                            <svg className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span className="leading-relaxed">{execution.notes}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 