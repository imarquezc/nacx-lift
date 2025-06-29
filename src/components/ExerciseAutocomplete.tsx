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
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={selectedExercise ? selectedExercise.name : query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (value) onChange(''); // Clear selection when typing
          }}
          onFocus={() => {
            if (query && filteredExercises.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full px-6 py-4 pr-12 text-lg rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-0 focus:outline-none transition-colors"
        />
        {selectedExercise && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setQuery('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
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