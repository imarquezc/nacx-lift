import { ReactNode } from 'react';

interface MuscleGroupIconProps {
  name: string;
  className?: string;
}

// Small color-coded silhouettes so a day's training can be read at a glance.
// Keyed by the muscle group names seeded in the database.
const ICONS: Record<string, { color: string; shape: ReactNode }> = {
  Chest: {
    color: 'text-rose-500',
    shape: (
      <>
        <path d="M10 3h4v4h-4z" />
        <rect x="3.5" y="6.5" width="8" height="8.5" rx="2.5" />
        <rect x="12.5" y="6.5" width="8" height="8.5" rx="2.5" />
      </>
    ),
  },
  Back: {
    color: 'text-blue-500',
    shape: (
      <>
        <path d="M4 5h7.2v14.2c-2.6-.3-4.6-2-5.4-4.6L4 8z" />
        <path d="M20 5h-7.2v14.2c2.6-.3 4.6-2 5.4-4.6L20 8z" />
      </>
    ),
  },
  Shoulders: {
    color: 'text-amber-500',
    shape: (
      <>
        <circle cx="12" cy="6.5" r="3.5" />
        <path d="M2.5 19c0-5 4.5-7.5 9.5-7.5s9.5 2.5 9.5 7.5v.5h-19z" />
      </>
    ),
  },
  Biceps: {
    color: 'text-violet-500',
    shape: (
      <path d="M7.5 3C9.4 3 10.5 4.2 10.5 6v3.2c0 1.2 1 2 2.2 2.1 3.4.3 6.3 2.3 6.3 5.2 0 3-3 4.9-6.9 4.9C7 21.4 4 18.2 4 13.4V6c0-1.8 1.4-3 3.5-3z" />
    ),
  },
  Triceps: {
    color: 'text-cyan-600',
    shape: (
      <path d="M16.5 3c-1.9 0-3 1.2-3 3v3.2c0 1.2-1 2-2.2 2.1-3.4.3-6.3 2.3-6.3 5.2 0 3 3 4.9 6.9 4.9 5.1 0 8.1-3.2 8.1-8V6c0-1.8-1.4-3-3.5-3z" />
    ),
  },
  Legs: {
    color: 'text-emerald-600',
    shape: (
      <>
        <path d="M6.5 3h4.2l-.6 9.5.7 8.5H7.6l-.9-8.7z" />
        <path d="M17.5 3h-4.2l.6 9.5-.7 8.5h3.2l.9-8.7z" />
      </>
    ),
  },
};

export default function MuscleGroupIcon({ name, className = '' }: MuscleGroupIconProps) {
  const icon = ICONS[name];

  if (!icon) {
    return (
      <span
        title={name}
        className={`inline-flex w-4 h-4 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-[9px] font-bold ${className}`}
      >
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${icon.color} ${className}`}>
      <title>{name}</title>
      {icon.shape}
    </svg>
  );
}
