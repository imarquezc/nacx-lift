# Nacx Lift - Gym Progress Tracker

A web application for tracking gym workout progress by monitoring muscle group exercise ratios. The app helps you maintain balanced workouts by setting targets for each muscle group and tracking your progress against these goals.

## Overview

Nacx Lift allows you to:
- Create workout plans with specific muscle group targets (e.g., 5 chest exercises, 5 biceps, 10 legs)
- Track exercise executions that contribute to muscle group counts
- Monitor progress with visual indicators showing completion ratios
- Maintain an ideal balance across all muscle groups

For example: If you set targets of 5 chest, 5 biceps, and 10 leg exercises, and complete 2 leg exercises and 1 bicep exercise on Monday, your progress would show: 0/5 chest, 1/5 biceps, 2/10 legs.

## Tech Stack

- **Frontend**: Next.js 15.3.2 with TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Supabase client with TypeScript types
- **Deployment**: Vercel-ready

## Database Schema

### muscle_groups
Stores the different muscle groups that exercises can target.
- `id` (UUID): Primary key
- `name` (TEXT): Unique name of the muscle group (e.g., "Chest", "Biceps", "Legs")

### exercises
Public repository of exercises that all users can access and use.
- `id` (UUID): Primary key
- `name` (TEXT): Exercise name
- `primary_muscle_group_id` (UUID): Main muscle group targeted
- `secondary_muscle_group_id` (UUID, nullable): Optional secondary muscle group
- `description` (TEXT, nullable): Exercise description
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### workout_plans
User-specific workout plans that define muscle group targets.
- `id` (UUID): Primary key
- `name` (TEXT): Plan name
- `description` (TEXT, nullable): Plan description
- `started_at` (TIMESTAMP): When the plan was started
- `completed_at` (TIMESTAMP, nullable): When the plan was completed
- `total_exercises_planned` (INTEGER): Total number of exercises planned (default: 100)
- `status` (TEXT): Plan status (draft, active, completed, archived)
- `user_id` (UUID): Reference to auth.users
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### workout_plan_muscle_targets
Defines target exercise counts for each muscle group in a workout plan.
- `id` (UUID): Primary key
- `workout_plan_id` (UUID): Reference to workout plan
- `muscle_group_id` (UUID): Reference to muscle group
- `exercises_target` (INTEGER): Target number of exercises for this muscle group
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp
- Unique constraint on (workout_plan_id, muscle_group_id)

### exercise_executions
Records each time a user performs an exercise as part of their workout plan.
- `id` (UUID): Primary key
- `workout_plan_id` (UUID): Reference to workout plan
- `exercise_id` (UUID): Reference to exercise
- `executed_at` (TIMESTAMP): When the exercise was performed
- `sets` (INTEGER): Number of sets performed
- `reps` (INTEGER): Number of repetitions per set
- `weight_kg` (INTEGER): Weight used in kilograms
- `location` (TEXT, nullable): Where the exercise was performed (e.g., "Home", "Gym")
- `notes` (TEXT, nullable): Additional notes about the execution
- `completed` (BOOLEAN): Whether the exercise was completed
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

## Security

The application uses Row Level Security (RLS) policies:
- **muscle_groups**: Read-only for all users
- **exercises**: Read-only for all users, authenticated users can create/update/delete
- **workout_plans**: Users can only access their own plans
- **workout_plan_muscle_targets**: Users can only access targets for their own plans
- **exercise_executions**: Users can only access executions for their own plans

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Supabase project URL and anon key

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Features

- **Progress Tracking**: Visual progress bars show completion ratio for each muscle group
- **Exercise Library**: Shared exercise database accessible to all users
- **Flexible Logging**: Track sets, reps, weight, location, and notes for each exercise
- **Real-time Updates**: Changes are immediately reflected in the UI
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
