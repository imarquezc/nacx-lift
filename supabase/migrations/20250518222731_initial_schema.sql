-- Initial migration for workout tracking application

DROP TABLE IF EXISTS public.exercise_executions CASCADE;
DROP TABLE IF EXISTS public.workout_plan_muscle_targets CASCADE;
DROP TABLE IF EXISTS public.workout_plans CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.muscle_groups CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create muscle_groups table
CREATE TABLE public.muscle_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE
);

-- Create exercises table
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  primary_muscle_group_id UUID REFERENCES public.muscle_groups(id) NOT NULL,
  secondary_muscle_group_id UUID REFERENCES public.muscle_groups(id),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create workout_plans table
CREATE TABLE public.workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_exercises_planned INTEGER DEFAULT 100,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create workout_plan_muscle_targets table
CREATE TABLE public.workout_plan_muscle_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE NOT NULL,
  muscle_group_id UUID REFERENCES public.muscle_groups(id) NOT NULL,
  exercises_target INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(workout_plan_id, muscle_group_id)
);

-- Create exercise_executions table
CREATE TABLE public.exercise_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  sets INTEGER DEFAULT 0,
  reps INTEGER DEFAULT 0,
  weight_kg INTEGER DEFAULT 0,
  location TEXT,
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_exercises_primary_muscle ON public.exercises(primary_muscle_group_id);
CREATE INDEX idx_exercises_secondary_muscle ON public.exercises(secondary_muscle_group_id);
CREATE INDEX idx_workout_plans_user_id ON public.workout_plans(user_id);
CREATE INDEX idx_workout_plan_muscle_targets_workout_plan_id ON public.workout_plan_muscle_targets(workout_plan_id);
CREATE INDEX idx_workout_plan_muscle_targets_muscle_group_id ON public.workout_plan_muscle_targets(muscle_group_id);
CREATE INDEX idx_exercise_executions_workout_plan_id ON public.exercise_executions(workout_plan_id);
CREATE INDEX idx_exercise_executions_exercise_id ON public.exercise_executions(exercise_id);
CREATE INDEX idx_exercise_executions_executed_at ON public.exercise_executions(executed_at);

-- Enable Row Level Security
ALTER TABLE public.muscle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plan_muscle_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_executions ENABLE ROW LEVEL SECURITY;

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp triggers
CREATE TRIGGER set_updated_at_exercises
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_workout_plans
  BEFORE UPDATE ON public.workout_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_workout_plan_muscle_targets
  BEFORE UPDATE ON public.workout_plan_muscle_targets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_exercise_executions
  BEFORE UPDATE ON public.exercise_executions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS Policies

-- muscle_groups policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view muscle groups" 
  ON public.muscle_groups FOR SELECT 
  USING (true);

-- exercises policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view exercises" 
  ON public.exercises FOR SELECT 
  USING (true);

-- workout_plans policies (users can only access their own)
CREATE POLICY "Users can view their own workout plans" 
  ON public.workout_plans FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout plans" 
  ON public.workout_plans FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout plans" 
  ON public.workout_plans FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plans" 
  ON public.workout_plans FOR DELETE 
  USING (auth.uid() = user_id);

-- workout_plan_muscle_targets policies
CREATE POLICY "Users can view their own workout plan muscle targets" 
  ON public.workout_plan_muscle_targets FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_plans
      WHERE workout_plans.id = workout_plan_muscle_targets.workout_plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own workout plan muscle targets" 
  ON public.workout_plan_muscle_targets FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_plans
      WHERE workout_plans.id = workout_plan_muscle_targets.workout_plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own workout plan muscle targets" 
  ON public.workout_plan_muscle_targets FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_plans
      WHERE workout_plans.id = workout_plan_muscle_targets.workout_plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own workout plan muscle targets" 
  ON public.workout_plan_muscle_targets FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_plans
      WHERE workout_plans.id = workout_plan_muscle_targets.workout_plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

-- exercise_executions policies
CREATE POLICY "Users can view their own exercise executions" 
  ON public.exercise_executions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_plans
      WHERE workout_plans.id = exercise_executions.workout_plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own exercise executions" 
  ON public.exercise_executions FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_plans
      WHERE workout_plans.id = exercise_executions.workout_plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own exercise executions" 
  ON public.exercise_executions FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_plans
      WHERE workout_plans.id = exercise_executions.workout_plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own exercise executions" 
  ON public.exercise_executions FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_plans
      WHERE workout_plans.id = exercise_executions.workout_plan_id
      AND workout_plans.user_id = auth.uid()
    )
  );

-- Insert default muscle groups
INSERT INTO public.muscle_groups (name) VALUES
  ('Chest'),
  ('Back'),
  ('Shoulders'),
  ('Biceps'),
  ('Triceps'),
  ('Legs');