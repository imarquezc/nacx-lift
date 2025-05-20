-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view exercises" ON public.exercises;
DROP POLICY IF EXISTS "Authenticated users can create exercises" ON public.exercises;
DROP POLICY IF EXISTS "Users can update their own exercises" ON public.exercises;
DROP POLICY IF EXISTS "Users can delete their own exercises" ON public.exercises;

-- Recreate the view policy
CREATE POLICY "Anyone can view exercises" 
  ON public.exercises FOR SELECT 
  USING (true);

-- Add policy to allow authenticated users to create exercises
CREATE POLICY "Authenticated users can create exercises" 
  ON public.exercises FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Add policy to allow users to update their own exercises
CREATE POLICY "Users can update their own exercises" 
  ON public.exercises FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Add policy to allow users to delete their own exercises
CREATE POLICY "Users can delete their own exercises" 
  ON public.exercises FOR DELETE 
  USING (auth.role() = 'authenticated'); 