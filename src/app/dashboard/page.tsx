'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface WorkoutPlan {
  id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'completed' | 'archived';
  total_exercises_planned: number;
  created_at: string;
}

interface MuscleTarget {
  id: string;
  muscle_group_id: string;
  exercises_target: number;
  muscle_group: {
    id: string;
    name: string;
  };
}

interface ExerciseExecution {
  id: string;
  exercise_id: string;
  completed: boolean;
  exercise: {
    id: string;
    name: string;
    primary_muscle_group_id: string;
  };
}

export default function Dashboard() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [activeWorkoutPlan, setActiveWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [muscleTargets, setMuscleTargets] = useState<MuscleTarget[]>([]);
  const [exerciseExecutions, setExerciseExecutions] = useState<ExerciseExecution[]>([]);
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchActiveWorkoutPlan = async () => {
      if (!user) return;

      try {
        // Fetch most recent non-completed workout plan
        const { data: plans, error: plansError } = await supabase
          .from('workout_plans')
          .select('*')
          .or('status.eq.draft,status.eq.active,status.is.null')
          .order('updated_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
          .limit(1);

        if (plansError) throw plansError;

        if (plans && plans.length > 0) {
          const plan = plans[0];
          setActiveWorkoutPlan(plan);

          // Fetch muscle targets
          const { data: targets, error: targetsError } = await supabase
            .from('workout_plan_muscle_targets')
            .select(`
              *,
              muscle_group:muscle_groups(*)
            `)
            .eq('workout_plan_id', plan.id);

          if (targetsError) throw targetsError;
          setMuscleTargets(targets || []);

          // Fetch exercise executions
          const { data: executions, error: executionsError } = await supabase
            .from('exercise_executions')
            .select(`
              *,
              exercise:exercises(*)
            `)
            .eq('workout_plan_id', plan.id);

          if (executionsError) throw executionsError;
          setExerciseExecutions(executions || []);
        }
      } catch (error) {
        console.error('Error fetching active workout plan:', error);
      } finally {
        setIsLoadingWorkout(false);
      }
    };

    if (user) {
      fetchActiveWorkoutPlan();
    }
  }, [user, supabase]);

  const getMuscleGroupProgress = (muscleGroupId: string) => {
    const target = muscleTargets.find(t => t.muscle_group_id === muscleGroupId);
    const completed = exerciseExecutions.filter(e => 
      e.exercise.primary_muscle_group_id === muscleGroupId && e.completed
    ).length;
    
    return {
      target: target?.exercises_target || 0,
      completed,
      percentage: target?.exercises_target ? (completed / target.exercises_target) * 100 : 0
    };
  };

  const getOverallProgress = () => {
    const totalTarget = muscleTargets.reduce((acc, target) => acc + target.exercises_target, 0);
    const totalCompleted = exerciseExecutions.filter(e => e.completed).length;
    
    return {
      target: totalTarget,
      completed: totalCompleted,
      percentage: totalTarget > 0 ? (totalCompleted / totalTarget) * 100 : 0
    };
  };

  if (isLoading || isLoadingWorkout) {
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
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="font-semibold text-slate-900">Nacx Lift</span>
              </div>
            </div>
            <button
              onClick={async () => {
                await signOut();
                router.push('/');
              }}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 pb-16">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Welcome back
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
            Track your fitness journey with precision. Build balanced workouts and monitor your progress across all muscle groups.
          </p>
        </div>

        {/* Active Workout Plan Progress */}
        {activeWorkoutPlan ? (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeWorkoutPlan.name}</h2>
                  {activeWorkoutPlan.description && (
                    <p className="text-slate-600">{activeWorkoutPlan.description}</p>
                  )}
                </div>
                <Link
                  href={`/dashboard/workout-plans/${activeWorkoutPlan.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  Continue Workout
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Overall Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">Overall Progress</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600">
                      {getOverallProgress().completed} / {getOverallProgress().target} exercises
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {Math.round(getOverallProgress().percentage)}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(getOverallProgress().percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Muscle Group Progress Grid */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Muscle Group Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {muscleTargets.map((target) => {
                    const progress = getMuscleGroupProgress(target.muscle_group_id);
                    return (
                      <div key={target.id} className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900">{target.muscle_group.name}</span>
                          <span className="text-xs font-medium text-slate-600">
                            {progress.completed}/{progress.target}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                          />
                        </div>
                        <div className="mt-1 text-right">
                          <span className="text-xs text-slate-500">{Math.round(progress.percentage)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No Workout Plans Yet</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              Start your fitness journey by creating your first workout plan with balanced muscle group targets.
            </p>
            <Link
              href="/dashboard/workout-plans/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Plan
            </Link>
          </div>
        )}

        {/* Secondary Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Create New Plan Card */}
          {!activeWorkoutPlan && (
            <Link 
              href="/dashboard/workout-plans/new"
              className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Create Workout Plan</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Design a new routine with muscle targets
                </p>
              </div>
            </Link>
          )}

          {/* Exercise Library Card */}
          <Link 
            href="/dashboard/exercises/new"
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Add Exercise</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Expand the community exercise library
              </p>
            </div>
          </Link>

          {/* All Plans Card */}
          <Link 
            href="/dashboard/workout-plans"
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">All Workout Plans</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                View your workout history and archives
              </p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}