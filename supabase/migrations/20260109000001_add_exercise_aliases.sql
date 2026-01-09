-- Migration: Add aliases column to exercises table for alternative names
-- Date: 2026-01-09

-- ============================================
-- PART 1: Enable required extensions
-- ============================================

-- Enable the pg_trgm extension for trigram-based text search (must be before using gin_trgm_ops)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================
-- PART 2: Add aliases column
-- ============================================

ALTER TABLE exercises ADD COLUMN aliases TEXT[] DEFAULT '{}';

-- ============================================
-- PART 3: Create GIN index for efficient array searching
-- This index enables fast searches using ANY(), @>, and other array operators
-- ============================================

CREATE INDEX idx_exercises_aliases ON exercises USING GIN (aliases);

-- ============================================
-- PART 4: Create a text search index for combined name + aliases searching
-- This enables fast ILIKE searches across the name field
-- ============================================

CREATE INDEX idx_exercises_name_trgm ON exercises USING GIN (name gin_trgm_ops);

-- ============================================
-- PART 5: Create a function for searching exercises by name or alias
-- This can be used directly or via RPC call from the app
-- ============================================

CREATE OR REPLACE FUNCTION search_exercises(search_term TEXT)
RETURNS SETOF exercises AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM exercises
  WHERE
    name ILIKE '%' || search_term || '%'
    OR EXISTS (
      SELECT 1 FROM unnest(aliases) AS alias
      WHERE alias ILIKE '%' || search_term || '%'
    )
  ORDER BY
    -- Prioritize exact name matches, then name starts with, then alias matches
    CASE
      WHEN name ILIKE search_term THEN 0
      WHEN name ILIKE search_term || '%' THEN 1
      WHEN name ILIKE '%' || search_term || '%' THEN 2
      ELSE 3
    END,
    name;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PART 5: Populate aliases for exercises with common alternative names
-- ============================================

-- CHEST exercises
UPDATE exercises SET aliases = ARRAY['RDL', 'Stiff Leg Deadlift', 'SLDL'] WHERE name = 'Romanian Deadlift';
UPDATE exercises SET aliases = ARRAY['Flat Bench', 'Barbell Bench', 'BB Bench Press'] WHERE name = 'Bench Press';
UPDATE exercises SET aliases = ARRAY['DB Bench', 'Dumbbell Flat Bench'] WHERE name = 'Dumbbell Bench Press';
UPDATE exercises SET aliases = ARRAY['Incline DB Press', 'Incline Dumbbell Bench'] WHERE name = 'Incline Press (Free Weight)';
UPDATE exercises SET aliases = ARRAY['Decline Barbell Press', 'Decline BB Press'] WHERE name = 'Decline Bench Press';
UPDATE exercises SET aliases = ARRAY['Decline DB Press'] WHERE name = 'Decline Dumbbell Press';
UPDATE exercises SET aliases = ARRAY['Cable Crossover', 'High Cable Fly', 'High to Low Cable Fly'] WHERE name = 'Cable Chest Flyes (High)';
UPDATE exercises SET aliases = ARRAY['Low Cable Fly', 'Low to High Cable Fly', 'Cable Crossover Low'] WHERE name = 'Cable Chest Flyes (Low)';
UPDATE exercises SET aliases = ARRAY['Pec Fly', 'Pec Fly Machine', 'Butterfly Machine'] WHERE name = 'Pec Deck';
UPDATE exercises SET aliases = ARRAY['Chest Fly Machine', 'Machine Fly'] WHERE name = 'Pectoral Machine';
UPDATE exercises SET aliases = ARRAY['DB Pullover', 'Straight Arm Pullover'] WHERE name = 'Dumbbell Pullover';
UPDATE exercises SET aliases = ARRAY['Press-ups', 'Pushup'] WHERE name = 'Push-ups';
UPDATE exercises SET aliases = ARRAY['Triangle Push-ups', 'Close Grip Push-ups'] WHERE name = 'Diamond Push-ups';
UPDATE exercises SET aliases = ARRAY['Landmine Chest Press', 'Angled Press'] WHERE name = 'Landmine Press';

-- BACK exercises
UPDATE exercises SET aliases = ARRAY['Chinup', 'Chin up', 'Supinated Pull-up', 'Underhand Pull-up'] WHERE name = 'Chin-ups';
UPDATE exercises SET aliases = ARRAY['Pullup', 'Pull up', 'Overhand Pullup'] WHERE name = 'Pull-ups';
UPDATE exercises SET aliases = ARRAY['Hammer Grip Pull-ups', 'Parallel Grip Pull-ups'] WHERE name = 'Neutral Grip Pull-ups';
UPDATE exercises SET aliases = ARRAY['Cable Pulldown', 'Pulldown', 'Wide Grip Pulldown'] WHERE name = 'Lat Pulldown';
UPDATE exercises SET aliases = ARRAY['V-Bar Pulldown', 'Close Grip Lat Pulldown'] WHERE name = 'Lat Pulldown (Close Grip)';
UPDATE exercises SET aliases = ARRAY['BB Row', 'Barbell Bent Over Row'] WHERE name = 'Barbell Row';
UPDATE exercises SET aliases = ARRAY['One Arm Row', 'One Arm Dumbbell Row', 'Single Arm DB Row'] WHERE name = 'Single Arm Row';
UPDATE exercises SET aliases = ARRAY['DB Row', 'One Arm Row'] WHERE name = 'Dumbbell Row';
UPDATE exercises SET aliases = ARRAY['Seated Row', 'Low Row', 'Seated Cable Row'] WHERE name = 'Cable Row';
UPDATE exercises SET aliases = ARRAY['Landmine Row', 'Corner Row'] WHERE name = 'T-Bar Row';
UPDATE exercises SET aliases = ARRAY['Strict Row', 'Dead Stop Row'] WHERE name = 'Pendlay Row';
UPDATE exercises SET aliases = ARRAY['John Meadows Row', 'Landmine Single Arm Row'] WHERE name = 'Meadows Row';
UPDATE exercises SET aliases = ARRAY['Prone Row', 'Incline Bench Row', 'Supported Row'] WHERE name = 'Chest Supported Row';
UPDATE exercises SET aliases = ARRAY['Straight Arm Lat Pulldown', 'Stiff Arm Pulldown'] WHERE name = 'Straight Arm Pulldown';
UPDATE exercises SET aliases = ARRAY['Australian Pull-ups', 'Body Row', 'Horizontal Pull-up'] WHERE name = 'Inverted Row';
UPDATE exercises SET aliases = ARRAY['Bench Row', 'Prone Dumbbell Row'] WHERE name = 'Seal Row';
UPDATE exercises SET aliases = ARRAY['Rear Delt Fly', 'Bent Over Lateral Raise', 'Reverse Dumbbell Fly'] WHERE name = 'Reverse Fly';
UPDATE exercises SET aliases = ARRAY['Face Pull', 'Rope Face Pull', 'Cable Face Pull'] WHERE name = 'Facepull';
UPDATE exercises SET aliases = ARRAY['Trap Shrugs', 'Shoulder Shrugs', 'Dumbbell Shrugs', 'Barbell Shrugs'] WHERE name = 'Shrugs';
UPDATE exercises SET aliases = ARRAY['Block Pull', 'Partial Deadlift'] WHERE name = 'Rack Pull';
UPDATE exercises SET aliases = ARRAY['Snatch DL', 'Wide Grip Deadlift'] WHERE name = 'Snatch Grip Deadlift';

-- SHOULDERS exercises
UPDATE exercises SET aliases = ARRAY['OHP', 'Overhead Press', 'Strict Press', 'Standing Press'] WHERE name = 'Military Press';
UPDATE exercises SET aliases = ARRAY['Seated OHP', 'Seated Overhead Press', 'DB Shoulder Press'] WHERE name = 'Dumbbell Shoulder Press';
UPDATE exercises SET aliases = ARRAY['Seated Press', 'Seated DB Press'] WHERE name = 'Seated Dumbbell Press';
UPDATE exercises SET aliases = ARRAY['Arnold Shoulder Press', 'Rotating Shoulder Press'] WHERE name = 'Arnold Press';
UPDATE exercises SET aliases = ARRAY['Standing Push Press', 'Leg Drive Press'] WHERE name = 'Push Press';
UPDATE exercises SET aliases = ARRAY['Side Lateral Raise', 'Side Raise', 'Lateral Delt Raise', 'Side Delt Raise'] WHERE name = 'Lateral Raises';
UPDATE exercises SET aliases = ARRAY['DB Lateral Raise', 'Dumbbell Side Raise'] WHERE name = 'Lateral Raises (Dumbbell)';
UPDATE exercises SET aliases = ARRAY['Cable Side Raise', 'Single Arm Cable Lateral'] WHERE name = 'Cable Lateral Raises';
UPDATE exercises SET aliases = ARRAY['Front Delt Raise', 'Anterior Raise'] WHERE name = 'Front Raises';
UPDATE exercises SET aliases = ARRAY['Rear Delt Row', 'High Row'] WHERE name = 'Upright Row';
UPDATE exercises SET aliases = ARRAY['Rear Pec Deck', 'Reverse Fly Machine', 'Rear Delt Machine'] WHERE name = 'Reverse Pec Deck';
UPDATE exercises SET aliases = ARRAY['Rear Delt Cable Fly', 'Cable Rear Raise'] WHERE name = 'Cable Rear Delt Fly';
UPDATE exercises SET aliases = ARRAY['Band Pullapart', 'Resistance Band Pull Apart'] WHERE name = 'Band Pull-Aparts';
UPDATE exercises SET aliases = ARRAY['BTN Press', 'Behind Neck Press'] WHERE name = 'Behind the Neck Press';
UPDATE exercises SET aliases = ARRAY['Seated Floor Press', 'Floor Seated Press'] WHERE name = 'Z Press';
UPDATE exercises SET aliases = ARRAY['Y Raise', 'Overhead Y Raise'] WHERE name = 'Lu Raises';
UPDATE exercises SET aliases = ARRAY['External Rotation Press', 'Rotator Cuff Press'] WHERE name = 'Cuban Press';

-- BICEPS exercises
UPDATE exercises SET aliases = ARRAY['DB Curl', 'Dumbbell Curl', 'Standing Curl'] WHERE name = 'Dumbbell Bicep Curls';
UPDATE exercises SET aliases = ARRAY['BB Curl', 'Standing Barbell Curl'] WHERE name = 'Barbell Bicep Curls';
UPDATE exercises SET aliases = ARRAY['Neutral Grip Curl', 'DB Hammer Curl'] WHERE name = 'Hammer Curls';
UPDATE exercises SET aliases = ARRAY['Cross Hammer Curl', 'Crossbody Curl'] WHERE name = 'Cross Body Hammer Curls';
UPDATE exercises SET aliases = ARRAY['Preacher Bench Curl', 'Scott Curl', 'Larry Scott Curl'] WHERE name = 'Preacher Curls';
UPDATE exercises SET aliases = ARRAY['Isolation Curl', 'Seated Concentration Curl'] WHERE name = 'Concentration Curls';
UPDATE exercises SET aliases = ARRAY['Cable Curl', 'Low Pulley Curl'] WHERE name = 'Cable Bicep Curls';
UPDATE exercises SET aliases = ARRAY['Incline Curl', 'Incline DB Curl', 'Lying Incline Curl'] WHERE name = 'Incline Dumbbell Curls';
UPDATE exercises SET aliases = ARRAY['Prone Incline Curl', 'Chest Supported Curl'] WHERE name = 'Spider Curls';
UPDATE exercises SET aliases = ARRAY['EZ Curl', 'EZ Bar Bicep Curl', 'Cambered Bar Curl'] WHERE name = 'EZ Bar Curls';
UPDATE exercises SET aliases = ARRAY['Body Drag Curl', 'Barbell Drag Curl'] WHERE name = 'Drag Curls';
UPDATE exercises SET aliases = ARRAY['Zottman Dumbbell Curl', 'Rotating Curl'] WHERE name = 'Zottman Curls';
UPDATE exercises SET aliases = ARRAY['Overhand Curl', 'Pronated Curl', 'Reverse Grip Curl'] WHERE name = 'Reverse Curls';
UPDATE exercises SET aliases = ARRAY['21 Curls', 'Bicep 21s', '7-7-7 Curls'] WHERE name = '21s';

-- TRICEPS exercises
UPDATE exercises SET aliases = ARRAY['Lying Tricep Extension', 'Nose Breaker', 'French Press'] WHERE name = 'Skull Crusher';
UPDATE exercises SET aliases = ARRAY['Tricep Dip', 'Parallel Bar Dip', 'Chest Dip'] WHERE name = 'Dips';
UPDATE exercises SET aliases = ARRAY['Chair Dips', 'Tricep Bench Dip'] WHERE name = 'Bench Dips';
UPDATE exercises SET aliases = ARRAY['Pushdown', 'Tricep Pushdown', 'Cable Pushdown'] WHERE name = 'Tricep Pushdowns';
UPDATE exercises SET aliases = ARRAY['Cable Tricep Pushdown', 'Rope Pushdown', 'V-Bar Pushdown'] WHERE name = 'Cable Tricep Extension';
UPDATE exercises SET aliases = ARRAY['Single Arm Pushdown', 'One Arm Cable Extension'] WHERE name = 'Single Arm Cable Pushdown';
UPDATE exercises SET aliases = ARRAY['Overhead Extension', 'Standing Tricep Extension'] WHERE name = 'Overhead tricep extension';
UPDATE exercises SET aliases = ARRAY['DB Overhead Extension', 'Tricep Overhead Press'] WHERE name = 'Dumbbell Tricep Extension';
UPDATE exercises SET aliases = ARRAY['Cable Overhead Extension', 'Rope Overhead Tricep'] WHERE name = 'Rope Overhead Extension';
UPDATE exercises SET aliases = ARRAY['CGBP', 'Close Grip Press', 'Narrow Grip Bench'] WHERE name = 'Close Grip Bench Press';
UPDATE exercises SET aliases = ARRAY['Tricep Kickback', 'DB Kickback'] WHERE name = 'Tricep Kickbacks';
UPDATE exercises SET aliases = ARRAY['DB French Press', 'Lying French Press'] WHERE name = 'Dumbell French Press';
UPDATE exercises SET aliases = ARRAY['JM Blakley Press', 'Hybrid Skull Crusher'] WHERE name = 'JM Press';
UPDATE exercises SET aliases = ARRAY['Elbows Out Extension', 'Tate Dumbbell Press'] WHERE name = 'Tate Press';
UPDATE exercises SET aliases = ARRAY['Floor Tricep Extension', 'Rolling DB Extension'] WHERE name = 'Rolling Tricep Extension';
UPDATE exercises SET aliases = ARRAY['Close Grip Diamond Push-up', 'Tricep Push-up'] WHERE name = 'Diamond Close Grip Push-ups';

-- LEGS exercises
UPDATE exercises SET aliases = ARRAY['Back Squat', 'BB Squat', 'High Bar Squat', 'Low Bar Squat'] WHERE name = 'Barbell Squat';
UPDATE exercises SET aliases = ARRAY['Front Rack Squat', 'BB Front Squat', 'Olympic Squat'] WHERE name = 'Front Squat';
UPDATE exercises SET aliases = ARRAY['KB Squat', 'Kettlebell Squat', 'Goblet KB Squat'] WHERE name = 'Goblet Squat';
UPDATE exercises SET aliases = ARRAY['Wide Stance Squat', 'Plie Squat', 'Sumo Goblet Squat'] WHERE name = 'Sumo Squat';
UPDATE exercises SET aliases = ARRAY['Machine Squat', 'Reverse Hack Squat'] WHERE name = 'Hack Squat';
UPDATE exercises SET aliases = ARRAY['Zercher', 'Elbow Squat'] WHERE name = 'Zercher Squat';
UPDATE exercises SET aliases = ARRAY['Bench Squat', 'Squat to Box'] WHERE name = 'Box Squat';
UPDATE exercises SET aliases = ARRAY['Paused Squat', 'Bottom Pause Squat'] WHERE name = 'Pause Squat';
UPDATE exercises SET aliases = ARRAY['Static Lunge', 'Stationary Lunge'] WHERE name = 'Split Squat';
UPDATE exercises SET aliases = ARRAY['Bulgarian Lunge', 'Rear Foot Elevated Lunge', 'RFESS'] WHERE name = 'Bulgarian Split Squats';
UPDATE exercises SET aliases = ARRAY['Heel Elevated Squat', 'Quad Squat'] WHERE name = 'Cyclist Squat';
UPDATE exercises SET aliases = ARRAY['Single Leg Squat', 'One Leg Squat'] WHERE name = 'Pistol Squat';
UPDATE exercises SET aliases = ARRAY['Hip Belt Squat', 'Dip Belt Squat'] WHERE name = 'Belt Squat';
UPDATE exercises SET aliases = ARRAY['Conventional Deadlift', 'BB Deadlift', 'Regular Deadlift'] WHERE name = 'Deadlift';
UPDATE exercises SET aliases = ARRAY['Wide Stance Deadlift', 'Sumo DL'] WHERE name = 'Sumo Deadlift';
UPDATE exercises SET aliases = ARRAY['Block Deadlift', 'Elevated Deadlift'] WHERE name = 'Deficit Deadlift';
UPDATE exercises SET aliases = ARRAY['SLDL', 'Straight Leg DL'] WHERE name = 'Stiff Leg Deadlift';
UPDATE exercises SET aliases = ARRAY['Leg Press Machine', 'Horizontal Leg Press', '45 Degree Leg Press'] WHERE name = 'Leg Press';
UPDATE exercises SET aliases = ARRAY['One Leg Press', 'Unilateral Leg Press'] WHERE name = 'Single Leg Press';
UPDATE exercises SET aliases = ARRAY['Quad Extension', 'Knee Extension'] WHERE name = 'Leg Extension';
UPDATE exercises SET aliases = ARRAY['Hamstring Curl', 'Prone Leg Curl'] WHERE name = 'Lying Leg Curl';
UPDATE exercises SET aliases = ARRAY['Seated Hamstring Curl'] WHERE name = 'Seated Leg Curl';
UPDATE exercises SET aliases = ARRAY['Machine Leg Curl', 'Hamstring Curl Machine'] WHERE name = 'Leg Curl';
UPDATE exercises SET aliases = ARRAY['GHR', 'GHD Raise', 'Glute Ham Developer'] WHERE name = 'Glute Ham Raise';
UPDATE exercises SET aliases = ARRAY['Nordic Hamstring Curl', 'Russian Leg Curl', 'Natural GHR'] WHERE name = 'Nordic Curl';
UPDATE exercises SET aliases = ARRAY['Walking Lunge', 'Lunge Walk'] WHERE name = 'Walking Lunges';
UPDATE exercises SET aliases = ARRAY['Backward Lunge', 'Step Back Lunge'] WHERE name = 'Reverse Lunges';
UPDATE exercises SET aliases = ARRAY['Forward Lunge', 'Alternating Lunge'] WHERE name = 'Lunges';
UPDATE exercises SET aliases = ARRAY['Box Step Up', 'Bench Step Up'] WHERE name = 'Step-ups';
UPDATE exercises SET aliases = ARRAY['Barbell Hip Thrust', 'BB Hip Thrust', 'Weighted Glute Bridge'] WHERE name = 'Hip Thrust';
UPDATE exercises SET aliases = ARRAY['Floor Glute Bridge', 'Bodyweight Bridge'] WHERE name = 'Glute Bridge';
UPDATE exercises SET aliases = ARRAY['Good Mornings', 'GM', 'Barbell Good Morning'] WHERE name = 'Good Morning';
UPDATE exercises SET aliases = ARRAY['Standing Calf Raise', 'Calf Press'] WHERE name = 'Calf Raise';
UPDATE exercises SET aliases = ARRAY['Seated Calf Press', 'Bent Knee Calf Raise'] WHERE name = 'Seated Calf Raise';
UPDATE exercises SET aliases = ARRAY['Donkey Calf', 'Bent Over Calf Raise'] WHERE name = 'Donkey Calf Raise';
UPDATE exercises SET aliases = ARRAY['Inner Thigh Machine', 'Thigh Adductor'] WHERE name = 'Adductor Machine';
UPDATE exercises SET aliases = ARRAY['Outer Thigh Machine', 'Thigh Abductor', 'Hip Abductor'] WHERE name = 'Abductor Machine';
UPDATE exercises SET aliases = ARRAY['Cable Hip Abduction', 'Standing Abduction'] WHERE name = 'Cable Abduction';
UPDATE exercises SET aliases = ARRAY['Cable Hip Adduction', 'Standing Adduction'] WHERE name = 'Cable Adduction';
UPDATE exercises SET aliases = ARRAY['Cable Hip Hinge', 'Romanian Pull Through'] WHERE name = 'Cable Pull Through';
UPDATE exercises SET aliases = ARRAY['Power Clean from Floor', 'Olympic Clean'] WHERE name = 'Power Clean';
UPDATE exercises SET aliases = ARRAY['Sissy Squat Machine', 'Bodyweight Sissy'] WHERE name = 'Sissy Squat';
