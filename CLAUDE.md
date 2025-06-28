# Project Instructions for Claude

## Code Quality Checks

Before completing any coding task, always run the following commands to ensure code quality:

1. **Linter**: `npm run lint`
2. **TypeScript Check**: `npx tsc --noEmit` or `npm run build`

Both commands must pass without errors before considering the task complete.

## Project Context

This is a fitness tracking application (Nacx Lift) built with:
- Next.js 15.3.2
- TypeScript
- Supabase for backend
- Tailwind CSS for styling

## Key Features

- Workout plan management
- Exercise tracking with sets, reps, and weight
- Muscle group progress monitoring
- Community exercise library