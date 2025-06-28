'use client';

import { useState, useEffect } from 'react';

interface WeightSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export default function WeightSlider({ 
  value, 
  onChange, 
  min = 0, 
  max = 200,
  step = 2.5,
  unit = 'kg'
}: WeightSliderProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setDisplayValue(newValue);
  };

  const handleSliderRelease = () => {
    onChange(displayValue);
  };

  const percentage = ((displayValue - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-4">
        <label className="text-lg font-semibold text-slate-700">Weight</label>
        <div className="text-3xl font-bold text-slate-900">
          {displayValue} <span className="text-xl text-slate-500">{unit}</span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
          }}
        />
        
        <div className="flex justify-between mt-2">
          <span className="text-sm text-slate-500">{min}{unit}</span>
          <span className="text-sm text-slate-500">{max}{unit}</span>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          background: #3b82f6;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.15s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          background: #3b82f6;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.15s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}