'use client';

import { useState, useRef, useCallback } from 'react';

interface WeightSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}

const STEPS = [1, 2.5, 10] as const;

export default function WeightSlider({
  value,
  onChange,
  min = 0,
  max = 200,
  unit = 'kg'
}: WeightSliderProps) {
  const [step, setStep] = useState(2.5);

  const lastTap = useRef(0);

  const adjust = useCallback((delta: number) => {
    const now = Date.now();
    if (now - lastTap.current < 100) return;
    lastTap.current = now;

    const newValue = Math.round((value + delta) * 10) / 10;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  }, [value, min, max, onChange]);

  return (
    <div className="flex flex-col items-center">
      <label className="text-lg font-semibold text-slate-700 mb-4">Weight</label>
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => adjust(-step)}
          disabled={value <= min}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300 text-slate-700 text-2xl sm:text-3xl font-bold active:bg-slate-300 touch-manipulation flex items-center justify-center"
        >
          −
        </button>

        <div className="w-24 h-20 sm:w-28 sm:h-24 bg-white rounded-2xl border-2 border-slate-200 flex flex-col items-center justify-center">
          <span className="text-3xl sm:text-4xl font-bold text-slate-900">{value}</span>
          <span className="text-xs text-slate-400">{unit}</span>
        </div>

        <button
          type="button"
          onClick={() => adjust(step)}
          disabled={value >= max}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300 text-slate-700 text-2xl sm:text-3xl font-bold active:bg-slate-300 touch-manipulation flex items-center justify-center"
        >
          +
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3">
        {STEPS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors touch-manipulation ${
              step === s
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
