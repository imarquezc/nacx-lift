-- Migration: Update exercise descriptions and add 65 new exercises
-- Date: 2026-01-09

-- ============================================
-- PART 1: Update descriptions for existing exercises
-- ============================================

-- Abductor Machine
UPDATE exercises SET description = 'Sit on machine with pads against outer thighs. Push legs outward against resistance, squeezing glutes at full extension, then return slowly.' WHERE id = '2deb2da0-6ebe-4fc9-891e-9b56cf5fafaf';

-- Adductor Machine
UPDATE exercises SET description = 'Sit on machine with pads against inner thighs. Squeeze legs together against resistance, hold briefly, then release with control.' WHERE id = '42c9d603-faec-4272-ac1d-603704b3780e';

-- Barbell Row
UPDATE exercises SET description = 'Bend at hips with flat back, grip barbell with overhand grip, pull to lower chest by driving elbows back, then lower with control.' WHERE id = '0e369510-fc7a-447a-abee-90e94505b9c7';

-- Barbell Squat
UPDATE exercises SET description = 'Position barbell on upper back, feet shoulder-width apart. Lower by bending knees and hips until thighs are parallel, then drive up through heels.' WHERE id = 'a7de462b-b883-472e-bbb8-da4fcad81b0a';

-- Bent Over Row
UPDATE exercises SET description = 'Hinge forward at hips holding dumbbells or barbell, pull weight to lower chest while keeping back flat, squeeze shoulder blades, then lower.' WHERE id = 'b00e8ac2-11f5-4904-89e3-535a689f5750';

-- Cable Abduction
UPDATE exercises SET description = 'Attach ankle strap to low pulley. Stand sideways to machine, lift leg away from body against resistance, then return with control.' WHERE id = '5584a44c-9e23-4e55-89e9-4d9023699cf7';

-- Cable Adduction
UPDATE exercises SET description = 'Attach ankle strap to low pulley. Stand sideways, pull leg across body toward the cable machine, squeezing inner thigh, then release slowly.' WHERE id = '6478f69a-efb7-4b64-97c6-4f55d8eb9e69';

-- Cable Bicep Curls
UPDATE exercises SET description = 'Stand facing cable machine with low pulley, grip handle with underhand grip, curl up while keeping elbows stationary, then lower slowly.' WHERE id = '9119171c-4a1f-412d-ad34-03d11a747ee9';

-- Cable Chest Flyes (High)
UPDATE exercises SET description = 'Set cables high, step forward, bring handles down and together in an arc motion, squeezing chest at the bottom. Great for lower chest.' WHERE id = '7cb54bc3-e8c4-4ca1-a297-6602f8e5f54e';

-- Cable Chest Flyes (Low)
UPDATE exercises SET description = 'Set cables low, step forward, bring handles up and together in an arc motion, squeezing chest at the top. Great for upper chest.' WHERE id = 'db59310a-6842-4c25-95a9-c0e891e8be71';

-- Cable Chest Flyes (Medium)
UPDATE exercises SET description = 'Set cables at chest height, step forward, bring handles together with arms slightly bent, squeezing chest at center.' WHERE id = '6c9c5125-14db-4cbb-9d25-f04c5873a000';

-- Cable Front Raises
UPDATE exercises SET description = 'Stand with cable behind you or at low pulley, raise arm straight forward to shoulder height, then lower with control. Targets front deltoid.' WHERE id = 'e379c835-9348-4674-814c-cc047fa7f661';

-- Cable Row
UPDATE exercises SET description = 'Sit at cable station, grip handle, pull toward lower chest keeping back straight and elbows close, squeeze shoulder blades, then extend.' WHERE id = 'd4f3cbaf-7d80-4cc7-aa82-50114f820364';

-- Cable Tricep Extension
UPDATE exercises SET description = 'Stand at cable machine with high pulley, grip rope or bar, push down by extending elbows while keeping upper arms stationary, then return.' WHERE id = 'b7250854-7c63-40f1-8a49-2f6f148e7717';

-- Calf Raise
UPDATE exercises SET description = 'Stand on raised surface with heels hanging off. Rise up on toes as high as possible, hold briefly, then lower heels below platform level.' WHERE id = '329abf0b-5c09-451d-ac97-5bf7a453cbb8';

-- Chest Press
UPDATE exercises SET description = 'Sit at chest press machine, grip handles at chest level, press forward until arms are extended, then return with control.' WHERE id = '2dabe892-837d-4393-a7b6-8a2ed47caac7';

-- Close Grip Bench Press
UPDATE exercises SET description = 'Lie on bench, grip barbell with hands shoulder-width apart. Lower to chest keeping elbows close to body, then press up. Emphasizes triceps.' WHERE id = 'a8da89e1-5976-4a7d-bd30-0ef08f499a6f';

-- Concentration Curls
UPDATE exercises SET description = 'Sit with elbow braced against inner thigh, curl dumbbell up toward shoulder while keeping upper arm stationary, then lower slowly.' WHERE id = '209edfb0-d41a-4fec-8568-bfb61e54d44b';

-- Deadlift
UPDATE exercises SET description = 'Stand with feet hip-width, grip barbell, keep back flat. Lift by extending hips and knees simultaneously, then lower with control.' WHERE id = 'ece4b989-512d-4777-a982-ee21e2016f43';

-- Diagonal Shoulder Raises
UPDATE exercises SET description = 'Hold dumbbell, raise arm diagonally across body from hip to opposite shoulder overhead, creating a diagonal path. Works multiple deltoid heads.' WHERE id = 'b59280fe-edd2-4832-92cb-4b4fec0df4a2';

-- Dumbbell Bench Press
UPDATE exercises SET description = 'Lie on bench with dumbbells at chest level. Press up until arms are extended, bringing weights together at top, then lower with control.' WHERE id = 'c6b07909-e699-438e-9b89-9abaa4db63e0';

-- Dumbbell Row
UPDATE exercises SET description = 'Place one knee and hand on bench, pull dumbbell from floor to hip keeping elbow close to body, squeeze back, then lower.' WHERE id = '2694b633-689c-43ef-ad1f-617a6eb8ec23';

-- Dumbbell Tricep Extension
UPDATE exercises SET description = 'Hold dumbbell overhead with both hands or one hand, lower behind head by bending elbow, then extend back to starting position.' WHERE id = 'd8f2fecb-f215-4a5b-888e-750f0c9277e4';

-- Dumbell French Press
UPDATE exercises SET description = 'Lie on bench holding dumbbell(s) overhead. Lower weight behind head by bending elbows, keeping upper arms vertical, then extend back up.' WHERE id = '5905015d-f1e5-45df-965f-e49a09f4eb1c';

-- Facepull
UPDATE exercises SET description = 'Set cable at face height, pull rope toward face separating hands, externally rotating shoulders at end position, then return. Great for rear delts.' WHERE id = '8a04cf63-83e2-4401-9a94-4ee6d416e0e5';

-- Front Raises
UPDATE exercises SET description = 'Stand holding dumbbells at thighs, raise one or both arms straight forward to shoulder height, then lower with control. Targets front deltoid.' WHERE id = '2235d89f-9c25-4846-ad28-b017174847af';

-- Glute Bridge
UPDATE exercises SET description = 'Lie on back with knees bent, feet flat. Drive through heels to lift hips until body forms straight line, squeeze glutes at top, then lower.' WHERE id = '115c527c-ec49-4f12-b0e8-9b6dc9a514ea';

-- Goblet Squat
UPDATE exercises SET description = 'Hold dumbbell or kettlebell at chest with both hands. Squat down keeping chest up and elbows between knees, then stand back up.' WHERE id = '0443350b-dc07-4f99-817d-9c015d3b1fad';

-- Good Morning
UPDATE exercises SET description = 'Place barbell on upper back, hinge forward at hips keeping back flat and knees slightly bent, then return to standing. Targets hamstrings.' WHERE id = '1c9e3b3d-4aa3-4d5b-ae2a-4c8aae15ed3e';

-- Hammer Curls
UPDATE exercises SET description = 'Hold dumbbells with neutral grip (palms facing each other), curl up keeping wrists straight, then lower. Works biceps and forearms.' WHERE id = '36514309-8035-4fd8-b505-addb7817f040';

-- High Pull
UPDATE exercises SET description = 'Start with barbell at thighs, explosively pull up leading with elbows until bar reaches chest height, then lower. Combines pull and shrug.' WHERE id = '1e366d5c-1921-4d50-b162-f00c4079745e';

-- Hip Thrust
UPDATE exercises SET description = 'Sit with upper back against bench, barbell across hips. Drive through heels to lift hips until body is level, squeeze glutes, then lower.' WHERE id = '6202364c-1c71-47b7-9728-52d7781c72f4';

-- Horizontal Leg Press Calf Press
UPDATE exercises SET description = 'On leg press machine, position feet low on platform. Push through toes to extend ankles, then lower heels for full calf stretch.' WHERE id = 'ff428124-78c6-41e6-a1d8-244f2416c48b';

-- Incline Bench Press
UPDATE exercises SET description = 'Set bench to 30-45 degrees, lower barbell to upper chest, then press up. Targets upper chest more than flat bench.' WHERE id = 'ee6177e2-75e3-459b-8b39-f98863b312df';

-- Lateral Raises
UPDATE exercises SET description = 'Stand with dumbbells at sides, raise arms out to shoulder height with slight elbow bend, then lower slowly. Targets lateral deltoid.' WHERE id = '4e66e56d-05f6-4604-bfa3-cf436dc27926';

-- Lat Pulldown
UPDATE exercises SET description = 'Sit at lat pulldown machine, grip bar wider than shoulders, pull down to upper chest while keeping torso upright, then return with control.' WHERE id = '91e02737-a140-46bd-9d1d-de2e957afde9';

-- Low row (Machine)
UPDATE exercises SET description = 'Sit at low row machine, grip handles, pull toward lower abdomen keeping back straight, squeeze shoulder blades together, then extend arms.' WHERE id = '666bb21a-cef3-449d-a707-7a76fd3872ca';

-- Lunges
UPDATE exercises SET description = 'Step forward into lunge position, lower back knee toward floor while keeping front knee over ankle, then push back to starting position.' WHERE id = '191c1ff3-2a6f-42f0-8427-b447fc1ff470';

-- Machine Bench Press
UPDATE exercises SET description = 'Sit at bench press machine, grip handles at chest level, press forward until arms extended, then return slowly. Great for beginners.' WHERE id = '9657d426-8417-4ddb-8c7d-731a87a90935';

-- Machine Row
UPDATE exercises SET description = 'Sit at rowing machine, chest against pad, pull handles back squeezing shoulder blades together, then extend arms with control.' WHERE id = 'dc674327-de47-4e42-ad13-4e7140d6706f';

-- Military Press
UPDATE exercises SET description = 'Stand or sit with barbell at shoulder level, press overhead until arms are fully extended, then lower to shoulders. Strict form, no leg drive.' WHERE id = '61b2b37e-90e2-43e0-8592-7637ab87669a';

-- Nordic Curl
UPDATE exercises SET description = 'Kneel with feet anchored, slowly lower torso forward by extending at knees while keeping hips extended, then pull back up using hamstrings.' WHERE id = 'fd922be5-fad5-445f-a3ec-1600cb5b465f';

-- Overhead tricep extension
UPDATE exercises SET description = 'Stand or sit, hold weight overhead with arms extended. Lower behind head by bending elbows, then press back up. Keep upper arms vertical.' WHERE id = '302f6aec-553b-4997-a13e-43fdcd95da75';

-- Pec Deck
UPDATE exercises SET description = 'Sit at pec deck machine, place forearms on pads, bring arms together in front of chest squeezing pecs, then return to start position.' WHERE id = 'd8a9dd0c-c413-4620-b6ff-6270481d19e6';

-- Pectoral Machine
UPDATE exercises SET description = 'Sit at machine with arms out to sides, bring handles together in front of chest by contracting pecs, then return with control.' WHERE id = '67f172f9-09c6-4ced-a8a4-527bd3cb92f6';

-- Plate Halo
UPDATE exercises SET description = 'Hold weight plate at chest, circle it around head in one direction, then reverse. Works shoulder mobility and stability through full range.' WHERE id = '543094e9-9690-4117-abf5-85b3a5320c58';

-- Power Clean
UPDATE exercises SET description = 'Start with barbell on floor, explosively pull while extending hips, catch bar at shoulders in front squat position, then stand. Full body power.' WHERE id = '7844cc43-5063-41d1-b45a-430fb08df975';

-- Preacher Curls
UPDATE exercises SET description = 'Rest upper arms on preacher bench pad, curl barbell or dumbbells up toward shoulders, then lower with full extension. Isolates biceps.' WHERE id = 'bd69f6c2-7d79-4ec7-8e55-8f40ad26b123';

-- Pull-ups
UPDATE exercises SET description = 'Hang from bar with overhand grip, pull body up until chin clears bar by driving elbows down, then lower with control.' WHERE id = '25bdf1d8-2b82-4c86-a68c-9da63e11c277';

-- Push Press
UPDATE exercises SET description = 'Start with barbell at shoulders, dip knees slightly, then explosively drive through legs while pressing bar overhead. Uses leg momentum.' WHERE id = '23ced7ea-5223-44b7-861d-ee80c4032a64';

-- Rack Pull
UPDATE exercises SET description = 'Set barbell on rack pins at knee height, grip bar and stand up by extending hips, squeezing glutes at top, then lower. Partial deadlift.' WHERE id = '72cff76b-718e-4c22-a2ce-65901972ecdd';

-- Reverse Fly
UPDATE exercises SET description = 'Bend forward at hips or lie face down on bench, raise dumbbells out to sides with slight elbow bend, squeezing rear delts, then lower.' WHERE id = 'f1b01f5b-c27c-4ebc-8a63-b5e5ab2063c2';

-- Reverse Lunges
UPDATE exercises SET description = 'Step backward into lunge position, lower back knee toward floor, then push through front foot to return. Easier on knees than forward lunges.' WHERE id = '6bae5eea-a0e2-49bc-adb7-3be3357a0e1a';

-- Romanian Deadlift
UPDATE exercises SET description = 'Hold barbell at hips, hinge forward keeping back flat and slight knee bend, lower until hamstrings stretch fully, then return to standing.' WHERE id = 'a39fdd87-44a6-40c9-a7b2-010199292a7c';

-- Seated Calf Raise
UPDATE exercises SET description = 'Sit at machine with knees under pad, raise heels as high as possible, hold briefly, then lower for full stretch. Targets soleus muscle.' WHERE id = 'a3ec39ae-300f-4028-a0ed-26986046d001';

-- Seated Dumbbell Bicep Curl (behind back)
UPDATE exercises SET description = 'Sit on incline bench, let arms hang behind body holding dumbbells. Curl up from stretched position, maximizing bicep range of motion.' WHERE id = 'a9903a70-b715-46e4-8d3e-b961a2b4570f';

-- Shoulder Circles
UPDATE exercises SET description = 'Hold light weight with arms extended to sides, make small circles forward then backward. Great warm-up for shoulder mobility.' WHERE id = 'b0e75cad-679d-4788-9db8-24151d60f683';

-- Single Arm Bench Press
UPDATE exercises SET description = 'Lie on bench, press one dumbbell while keeping other arm at side or holding bench. Challenges core stability and addresses imbalances.' WHERE id = '926d4cb2-532c-44ed-b60b-78a9693d2fdf';

-- Single Arm Push Press
UPDATE exercises SET description = 'Hold dumbbell at shoulder, dip knees, then drive through legs while pressing weight overhead. Single-arm version adds core challenge.' WHERE id = 'fd43a8f3-058a-4861-a0ee-17d895935ec8';

-- Single Arm Row
UPDATE exercises SET description = 'Place opposite hand and knee on bench, pull dumbbell from floor to hip keeping elbow close, squeeze lat, then lower.' WHERE id = '7ee4292b-4fb2-48f4-905b-7de17cba87b9';

-- Single Leg Press
UPDATE exercises SET description = 'Position one foot on leg press platform, lower weight by bending knee, then press back up. Works each leg independently.' WHERE id = 'ae843535-79d9-4c0d-9bda-888971a932c0';

-- Sissy Squat
UPDATE exercises SET description = 'Hold support, lean torso back while bending knees and rising onto toes, lower until thighs are parallel, then return. Isolates quads.' WHERE id = '87160e43-f06a-4e60-b993-2650d5651294';

-- Skull Crusher
UPDATE exercises SET description = 'Lie on bench with barbell or dumbbells overhead, lower weight toward forehead by bending elbows, then extend back up. Classic tricep exercise.' WHERE id = '7baca376-0e2c-4716-b58e-05d6bcc89d03';

-- Step-ups
UPDATE exercises SET description = 'Stand facing bench, step up with one foot pressing through heel to stand on top, then step down. Alternate legs or complete one side first.' WHERE id = '665ce7d1-3fcc-4cd8-a859-338a112972a8';

-- Sumo Squat
UPDATE exercises SET description = 'Stand with wide stance, toes pointed out 45 degrees. Squat down keeping knees tracking over toes, then stand. Emphasizes inner thighs and glutes.' WHERE id = 'e72b3357-cb35-479b-8c24-19519b6ce70f';

-- T-Bar Row
UPDATE exercises SET description = 'Straddle T-bar or landmine bar, grip handle, pull bar up toward chest keeping back flat, squeeze shoulder blades, then lower.' WHERE id = 'a00ae0b9-8a9a-4690-9e43-66be0b467f32';

-- Tricep Kickbacks
UPDATE exercises SET description = 'Bend at hips, upper arm parallel to floor, extend forearm back by straightening elbow, squeeze tricep at top, then lower.' WHERE id = '8ff9fea6-632d-4930-8179-68f67b32ee85';

-- Walking Lunges
UPDATE exercises SET description = 'Step forward into lunge, then bring back foot forward into next lunge step. Continue walking forward alternating legs.' WHERE id = 'bd589523-0f76-4885-93d7-589324810c2a';


-- ============================================
-- PART 2: Add 65 new exercises
-- ============================================

-- Muscle Group IDs for reference:
-- Chest: a38be16a-94bd-4f79-a54c-f6e78764663d
-- Back: 964c6cac-2d93-46d1-8bb9-29c29c89768e
-- Shoulders: e5806980-d44e-4b02-9d71-0e84ada75bf9
-- Biceps: b3ef3182-65b6-4137-bdba-270d84d467a3
-- Triceps: 6b57296b-5d9c-4244-b99d-0b4ac45b43bc
-- Legs: 631e0183-a53f-44d4-ad46-032e10a72ac7

INSERT INTO exercises (name, description, primary_muscle_group_id, secondary_muscle_group_id) VALUES

-- CHEST (8 new exercises)
('Decline Bench Press', 'Lie on decline bench, lower barbell to lower chest, then press up. Targets lower pec fibers.', 'a38be16a-94bd-4f79-a54c-f6e78764663d', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc'),
('Decline Dumbbell Press', 'Lie on decline bench, press dumbbells up from lower chest, bringing them together at top.', 'a38be16a-94bd-4f79-a54c-f6e78764663d', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc'),
('Dumbbell Pullover', 'Lie across bench, lower dumbbell behind head in arc motion, then pull back over chest. Works chest and lats.', 'a38be16a-94bd-4f79-a54c-f6e78764663d', '964c6cac-2d93-46d1-8bb9-29c29c89768e'),
('Svend Press', 'Press two weight plates together at chest level, extend arms forward squeezing plates, then return. Chest isolation.', 'a38be16a-94bd-4f79-a54c-f6e78764663d', NULL),
('Landmine Press', 'Hold barbell end at chest, press up and forward at an angle. Shoulder-friendly pressing variation.', 'a38be16a-94bd-4f79-a54c-f6e78764663d', 'e5806980-d44e-4b02-9d71-0e84ada75bf9'),
('Floor Press', 'Lie on floor with barbell or dumbbells, lower until upper arms touch floor, then press up. Limits range of motion.', 'a38be16a-94bd-4f79-a54c-f6e78764663d', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc'),
('Push-ups', 'Start in plank position, lower chest to floor by bending elbows, then push back up. Classic bodyweight chest exercise.', 'a38be16a-94bd-4f79-a54c-f6e78764663d', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc'),
('Diamond Push-ups', 'Push-up with hands forming diamond shape under chest. Emphasizes triceps and inner chest.', 'a38be16a-94bd-4f79-a54c-f6e78764663d', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc'),

-- BACK (10 new exercises)
('Chin-ups', 'Hang from bar with underhand grip, pull body up until chin clears bar. More bicep involvement than pull-ups.', '964c6cac-2d93-46d1-8bb9-29c29c89768e', 'b3ef3182-65b6-4137-bdba-270d84d467a3'),
('Neutral Grip Pull-ups', 'Pull-up using parallel handles with palms facing each other. Easier on shoulders than standard pull-ups.', '964c6cac-2d93-46d1-8bb9-29c29c89768e', 'b3ef3182-65b6-4137-bdba-270d84d467a3'),
('Pendlay Row', 'Barbell row from floor with torso parallel to ground, explosive pull to chest, return bar to floor each rep.', '964c6cac-2d93-46d1-8bb9-29c29c89768e', 'b3ef3182-65b6-4137-bdba-270d84d467a3'),
('Meadows Row', 'Landmine row from staggered stance, pulling bar toward hip. Unique angle for lat development.', '964c6cac-2d93-46d1-8bb9-29c29c89768e', 'b3ef3182-65b6-4137-bdba-270d84d467a3'),
('Chest Supported Row', 'Lie face down on incline bench, row dumbbells up to sides. Removes lower back strain from rowing.', '964c6cac-2d93-46d1-8bb9-29c29c89768e', 'b3ef3182-65b6-4137-bdba-270d84d467a3'),
('Straight Arm Pulldown', 'Stand at cable machine, push bar down in arc motion while keeping arms straight. Isolates lats.', '964c6cac-2d93-46d1-8bb9-29c29c89768e', NULL),
('Inverted Row', 'Hang under bar with body straight, pull chest to bar by squeezing shoulder blades, then lower. Bodyweight row.', '964c6cac-2d93-46d1-8bb9-29c29c89768e', 'b3ef3182-65b6-4137-bdba-270d84d467a3'),
('Seal Row', 'Lie face down on elevated bench, row dumbbells from full hang. Strict form eliminates momentum.', '964c6cac-2d93-46d1-8bb9-29c29c89768e', 'b3ef3182-65b6-4137-bdba-270d84d467a3'),
('Snatch Grip Deadlift', 'Deadlift with extra wide grip, increasing upper back and trap involvement.', '964c6cac-2d93-46d1-8bb9-29c29c89768e', '631e0183-a53f-44d4-ad46-032e10a72ac7'),
('Shrugs', 'Hold heavy weight at sides, elevate shoulders toward ears, hold briefly, then lower. Targets trapezius.', '964c6cac-2d93-46d1-8bb9-29c29c89768e', NULL),

-- SHOULDERS (12 new exercises)
('Arnold Press', 'Start with dumbbells at shoulders palms facing you, rotate palms out while pressing overhead. Full deltoid activation.', 'e5806980-d44e-4b02-9d71-0e84ada75bf9', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc'),
('Seated Dumbbell Press', 'Sit with back supported, press dumbbells from shoulder level to overhead, then lower with control.', 'e5806980-d44e-4b02-9d71-0e84ada75bf9', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc'),
('Behind the Neck Press', 'Press barbell from behind neck to overhead. Advanced move requiring good mobility. Use light weight.', 'e5806980-d44e-4b02-9d71-0e84ada75bf9', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc'),
('Z Press', 'Sit on floor with legs extended, press barbell overhead. No back support challenges core stability.', 'e5806980-d44e-4b02-9d71-0e84ada75bf9', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc'),
('Upright Row', 'Pull barbell or dumbbells up along body to chin level, leading with elbows. Targets side delts and traps.', 'e5806980-d44e-4b02-9d71-0e84ada75bf9', '964c6cac-2d93-46d1-8bb9-29c29c89768e'),
('Lu Raises', 'Raise dumbbells forward with thumbs up until overhead in a Y pattern. Named after Olympic lifter Lu Xiaojun.', 'e5806980-d44e-4b02-9d71-0e84ada75bf9', NULL),
('Reverse Pec Deck', 'Sit facing pec deck machine, push handles back by squeezing rear delts. Targets posterior deltoid.', 'e5806980-d44e-4b02-9d71-0e84ada75bf9', '964c6cac-2d93-46d1-8bb9-29c29c89768e'),
('Cable Rear Delt Fly', 'Set cables at shoulder height, pull handles across body targeting rear delts. Great for posture.', 'e5806980-d44e-4b02-9d71-0e84ada75bf9', '964c6cac-2d93-46d1-8bb9-29c29c89768e'),
('Band Pull-Aparts', 'Hold resistance band at shoulder width, pull apart by squeezing shoulder blades together. Great warm-up.', 'e5806980-d44e-4b02-9d71-0e84ada75bf9', '964c6cac-2d93-46d1-8bb9-29c29c89768e'),
('Landmine Lateral Raise', 'Hold barbell end, raise laterally in arc motion. Provides unique resistance curve.', 'e5806980-d44e-4b02-9d71-0e84ada75bf9', NULL),
('Cuban Press', 'Upright row to external rotation to overhead press. Great for shoulder health and rotator cuff.', 'e5806980-d44e-4b02-9d71-0e84ada75bf9', NULL),
('Bradford Press', 'Press barbell overhead, lower behind neck, press up again, lower to front. Continuous tension movement.', 'e5806980-d44e-4b02-9d71-0e84ada75bf9', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc'),

-- BICEPS (8 new exercises)
('Spider Curls', 'Lie face down on incline bench, curl dumbbells from hanging position. Constant tension on biceps.', 'b3ef3182-65b6-4137-bdba-270d84d467a3', NULL),
('Incline Dumbbell Curls', 'Lie back on incline bench, curl dumbbells from fully stretched position. Emphasizes long head of biceps.', 'b3ef3182-65b6-4137-bdba-270d84d467a3', NULL),
('EZ Bar Curls', 'Use EZ curl bar with angled grip, curl up to chest level. Easier on wrists than straight bar.', 'b3ef3182-65b6-4137-bdba-270d84d467a3', NULL),
('Drag Curls', 'Curl bar up while pulling elbows back, keeping bar close to body. Different bicep emphasis than standard curl.', 'b3ef3182-65b6-4137-bdba-270d84d467a3', NULL),
('Zottman Curls', 'Curl up with supinated grip, rotate to pronated grip at top, lower slowly. Works biceps and forearms.', 'b3ef3182-65b6-4137-bdba-270d84d467a3', NULL),
('Reverse Curls', 'Curl barbell or dumbbells with overhand grip. Targets brachioradialis and forearm extensors.', 'b3ef3182-65b6-4137-bdba-270d84d467a3', NULL),
('21s', '7 partial reps bottom half, 7 partial reps top half, 7 full reps. Intense bicep burnout technique.', 'b3ef3182-65b6-4137-bdba-270d84d467a3', NULL),
('Cross Body Hammer Curls', 'Curl dumbbell across body toward opposite shoulder with neutral grip. Hits brachialis differently.', 'b3ef3182-65b6-4137-bdba-270d84d467a3', NULL),

-- TRICEPS (8 new exercises)
('Dips', 'Support body on parallel bars, lower by bending elbows until shoulders below elbows, then press up.', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc', 'a38be16a-94bd-4f79-a54c-f6e78764663d'),
('Bench Dips', 'Hands on bench behind you, lower body by bending elbows, then press back up. Easier than parallel bar dips.', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc', 'a38be16a-94bd-4f79-a54c-f6e78764663d'),
('Diamond Close Grip Push-ups', 'Push-up with hands together in diamond shape. Tricep-focused bodyweight exercise.', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc', 'a38be16a-94bd-4f79-a54c-f6e78764663d'),
('JM Press', 'Hybrid of close grip bench and skull crusher. Lower bar to throat area, then press up. Advanced tricep move.', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc', 'a38be16a-94bd-4f79-a54c-f6e78764663d'),
('Tate Press', 'Lie on bench, start with dumbbells extended, lower toward chest by bending elbows outward, then extend.', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc', NULL),
('Rolling Tricep Extension', 'Lie on floor, lower dumbbells behind head, let elbows touch floor, then extend back up. Increased range.', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc', NULL),
('Single Arm Cable Pushdown', 'Pushdown with one arm at a time. Allows focus on each tricep individually and greater range of motion.', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc', NULL),
('Rope Overhead Extension', 'Face away from cable, extend rope overhead by straightening elbows, keeping upper arms stationary.', '6b57296b-5d9c-4244-b99d-0b4ac45b43bc', NULL),

-- LEGS (19 new exercises)
('Front Squat', 'Hold barbell across front shoulders, squat down keeping torso upright, then stand. Emphasizes quads.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Hack Squat', 'Use hack squat machine, squat down with back against pad, then press up. Targets quads with back support.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Zercher Squat', 'Hold barbell in crook of elbows, squat down, then stand. Unusual but effective squat variation.', '631e0183-a53f-44d4-ad46-032e10a72ac7', '964c6cac-2d93-46d1-8bb9-29c29c89768e'),
('Box Squat', 'Squat down to sit on box, pause briefly, then stand explosively. Teaches proper squat depth and power.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Pause Squat', 'Regular squat with 2-3 second pause at bottom position. Builds strength out of the hole.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Split Squat', 'Stand with one foot forward, one back on ground. Lower back knee toward floor, then stand. Static lunge position.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Cyclist Squat', 'Squat with heels elevated on plates, feet close together. Intense quad isolation.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Pistol Squat', 'Single leg squat with other leg extended forward. Advanced bodyweight leg exercise requiring balance.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Belt Squat', 'Use belt squat machine or belt attached to weight. Squats without spinal loading.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Pendulum Squat', 'Use pendulum squat machine for unique resistance curve. Very quad dominant.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Stiff Leg Deadlift', 'Deadlift variation with straighter legs, emphasizing hamstring stretch at bottom. Similar to RDL.', '631e0183-a53f-44d4-ad46-032e10a72ac7', '964c6cac-2d93-46d1-8bb9-29c29c89768e'),
('Sumo Deadlift', 'Wide stance deadlift with hands inside knees. More quad and adductor involvement than conventional.', '631e0183-a53f-44d4-ad46-032e10a72ac7', '964c6cac-2d93-46d1-8bb9-29c29c89768e'),
('Deficit Deadlift', 'Stand on raised platform for deadlift, increasing range of motion. Builds strength off the floor.', '631e0183-a53f-44d4-ad46-032e10a72ac7', '964c6cac-2d93-46d1-8bb9-29c29c89768e'),
('Lying Leg Curl', 'Lie face down on leg curl machine, curl heels toward glutes against resistance. Isolates hamstrings.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Seated Leg Curl', 'Sit at leg curl machine with pad above ankles, curl heels under seat. Different hamstring emphasis.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Glute Ham Raise', 'On GHD machine, lower torso forward, then pull back up using hamstrings and glutes. Intense posterior chain.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Donkey Calf Raise', 'Bend at hips on calf raise machine or with partner on back. Classic calf builder with great stretch.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Leg Press Calf Raise', 'On leg press machine, push through toes to work calves. Can go heavy with back support.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL),
('Cable Pull Through', 'Face away from cable, hinge at hips and pull cable through legs by squeezing glutes. Hip hinge pattern.', '631e0183-a53f-44d4-ad46-032e10a72ac7', NULL);
