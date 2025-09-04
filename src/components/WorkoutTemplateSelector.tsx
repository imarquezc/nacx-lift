'use client';

import { useState } from 'react';
import { WorkoutTemplate, workoutTemplates } from '@/utils/workoutTemplates';

interface WorkoutTemplateSelectorProps {
  onSelectTemplate: (template: WorkoutTemplate) => void;
  selectedTemplateId?: string;
}

export default function WorkoutTemplateSelector({ 
  onSelectTemplate,
  selectedTemplateId 
}: WorkoutTemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Quick Start Templates
        </h2>
        <p className="text-sm text-slate-600">
          Choose a template to instantly fill your workout plan
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workoutTemplates.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          const isHovered = hoveredTemplate === template.id;
          const totalExercises = template.values.reduce((sum, val) => sum + val, 0);

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              className={`
                relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300
                ${isSelected 
                  ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]' 
                  : 'hover:shadow-xl hover:scale-[1.02]'
                }
              `}
            >
              {/* Gradient Background */}
              <div 
                className={`
                  absolute inset-0 bg-gradient-to-br ${template.gradient}
                  ${isSelected || isHovered ? 'opacity-100' : 'opacity-90'}
                  transition-opacity duration-300
                `}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="text-4xl mb-3 filter drop-shadow-sm">
                  {template.icon}
                </div>

                {/* Title and Tagline */}
                <h3 className="text-white font-bold text-lg mb-1 drop-shadow-sm">
                  {template.name}
                </h3>
                <p className="text-white/90 text-sm mb-3 drop-shadow-sm">
                  {template.tagline}
                </p>

                {/* Exercise Count or Distribution Preview */}
                {template.values.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-white/80 text-xs font-medium">
                      {totalExercises} total exercises
                    </div>
                    
                    {/* Mini distribution bars on hover */}
                    {(isHovered || isSelected) && (
                      <div className="flex gap-1 h-8">
                        {template.values.map((value, index) => {
                          const muscleNames = ['C', 'B', 'S', 'Bi', 'Tr', 'L'];
                          const maxValue = Math.max(...template.values);
                          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                          
                          return (
                            <div 
                              key={index}
                              className="flex-1 flex flex-col items-center justify-end"
                            >
                              <div 
                                className="w-full bg-white/30 rounded-t transition-all duration-300"
                                style={{ height: `${height}%` }}
                              />
                              <span className="text-[10px] text-white/70 mt-1">
                                {muscleNames[index]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-white/80 text-xs">
                    Start with empty form
                  </div>
                )}
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-white rounded-full p-1">
                  <svg 
                    className="w-5 h-5 text-blue-500" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile scroll hint */}
      <div className="sm:hidden text-center mt-4 text-xs text-slate-500">
        Swipe to see more templates →
      </div>
    </div>
  );
}