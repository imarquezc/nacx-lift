-- Add unique constraint to exercise names to ensure no duplicates
ALTER TABLE public.exercises ADD CONSTRAINT exercises_name_unique UNIQUE (name);

-- Add index for better performance on name lookups
CREATE INDEX IF NOT EXISTS idx_exercises_name ON public.exercises(name);