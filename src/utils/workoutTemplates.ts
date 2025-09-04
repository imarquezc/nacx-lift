export interface WorkoutTemplate {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  // Values correspond to muscle groups in order: Chest, Back, Shoulders, Biceps, Triceps, Legs
  values: number[];
  gradient: string; // Tailwind gradient classes for the card
}

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'balanced',
    name: 'Perfectly Balanced',
    tagline: 'Equal focus all muscles',
    icon: '⚖️',
    values: [17, 18, 17, 14, 14, 20], // 100 total - very balanced like the screenshot
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'push-pull-legs',
    name: 'Push Pull Legs',
    tagline: 'Classic 3-day split',
    icon: '🎯',
    values: [20, 22, 18, 12, 12, 25], // 109 total - PPL distribution
    gradient: 'from-purple-400 to-pink-500'
  },
  {
    id: 'upper-lower',
    name: 'Upper/Lower Split',
    tagline: 'Balanced upper & lower',
    icon: '💪',
    values: [18, 20, 16, 13, 13, 28], // 108 total - upper/lower focus
    gradient: 'from-green-400 to-emerald-500'
  },
  {
    id: 'hypertrophy',
    name: 'Hypertrophy Focus',
    tagline: 'Volume for muscle growth',
    icon: '📈',
    values: [22, 24, 20, 16, 16, 26], // 124 total - higher volume, balanced
    gradient: 'from-orange-400 to-red-500'
  },
  {
    id: 'strength',
    name: 'Strength Builder',
    tagline: 'Compound movement focus',
    icon: '🏋️',
    values: [16, 18, 14, 10, 10, 22], // 89 total - focus on big compounds
    gradient: 'from-slate-500 to-slate-700'
  },
  {
    id: 'start-fresh',
    name: 'Start Fresh',
    tagline: 'Design your own',
    icon: '✨',
    values: [], // Empty - start from scratch
    gradient: 'from-slate-400 to-slate-500'
  }
];

// Helper function to apply template values to muscle targets
export function applyTemplateToTargets(
  template: WorkoutTemplate,
  muscleGroups: { id: string; name: string }[]
): { muscle_group_id: string; exercises_target: number | '' }[] {
  // Map muscle group names to their expected order in template values
  const muscleGroupOrder = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs'];
  
  return muscleGroups.map(group => {
    const index = muscleGroupOrder.findIndex(name => 
      name.toLowerCase() === group.name.toLowerCase()
    );
    
    const value = index !== -1 && template.values[index] !== undefined 
      ? template.values[index] 
      : '';
    
    return {
      muscle_group_id: group.id,
      exercises_target: value
    };
  });
}