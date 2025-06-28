'use client';

import { useState, useEffect, useRef } from 'react';

interface Exercise {
  id: string;
  name: string;
  description?: string;
}

interface ExerciseAutocompleteProps {
  exercises: Exercise[];
  value: string;
  onChange: (exerciseId: string) => void;
  placeholder?: string;
}

export default function ExerciseAutocomplete({ 
  exercises, 
  value, 
  onChange, 
  placeholder = "Type to search exercises..." 
}: ExerciseAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedExercise = exercises.find(e => e.id === value);

  useEffect(() => {
    if (query) {
      const filtered = exercises.filter(exercise => 
        exercise.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredExercises(filtered);
      setIsOpen(true);
    } else {
      setFilteredExercises([]);
      setIsOpen(false);
    }
  }, [query, exercises]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (exerciseId: string) => {
    onChange(exerciseId);
    const exercise = exercises.find(e => e.id === exerciseId);
    setQuery(exercise?.name || '');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={selectedExercise ? selectedExercise.name : query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (value) onChange(''); // Clear selection when typing
        }}
        onFocus={() => {
          if (selectedExercise) {
            setQuery('');
            onChange('');
          }
        }}
        placeholder={placeholder}
        className="w-full px-6 py-4 text-lg rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-0 focus:outline-none transition-colors"
      />
      
      {isOpen && filteredExercises.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl border-2 border-slate-200 shadow-xl max-h-60 overflow-y-auto">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => handleSelect(exercise.id)}
              className="w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="font-medium text-slate-900">{exercise.name}</div>
              {exercise.description && (
                <div className="text-sm text-slate-500 mt-1 line-clamp-2">{exercise.description}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}