'use client';

interface GymNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

export default function GymNumberInput({ 
  value, 
  onChange, 
  label, 
  min = 0, 
  max = 999,
  step = 1 
}: GymNumberInputProps) {
  const increment = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="text-lg font-semibold text-slate-700 mb-4">{label}</label>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="w-16 h-16 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300 text-slate-700 text-3xl font-bold transition-all duration-150 active:scale-95 flex items-center justify-center"
        >
          −
        </button>
        
        <div className="w-24 h-24 bg-white rounded-2xl border-2 border-slate-200 flex items-center justify-center">
          <span className="text-4xl font-bold text-slate-900">{value}</span>
        </div>
        
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="w-16 h-16 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300 text-slate-700 text-3xl font-bold transition-all duration-150 active:scale-95 flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
}