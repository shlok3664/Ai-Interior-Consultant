// Fix: Implemented ModeSelector component.
import React from 'react';
import type { AppMode } from '../types';

interface ModeSelectorProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  disabled: boolean;
}

const MODES: { id: AppMode; name: string; description: string; icon: React.ReactElement }[] = [
  {
    id: 'singleRoom',
    name: 'Reimagine a Room',
    description: 'Upload a photo of a single room and instantly redesign it.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    ),
  },
  {
    id: 'floorPlan',
    name: 'Visualize Floor Plan',
    description: 'Upload a 2D floor plan to generate concepts for each area.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
    ),
  },
  {
    id: 'trends',
    name: 'Explore Global Styles',
    description: 'Discover interior design trends from around the world.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.75 4a9 9 0 011.5 1.5M12 21a9 9 0 01-4.5-1.5m0 0V15m0 0a9 9 0 016.364-8.636" /></svg>
    ),
  },
  {
    id: 'palette',
    name: 'Discover a Palette',
    description: 'Extract a harmonious color palette from any image.',
    icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
    ),
  },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode, disabled }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {MODES.map((mode, index) => {
        const isSelected = currentMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            disabled={disabled}
            className={`relative group flex flex-col items-center justify-center text-center p-6 rounded-2xl border transition-all duration-300 transform 
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 hover:shadow-2xl active:scale-100'}
            ${isSelected
              ? 'bg-white/70 border-violet-500/80 shadow-lg dark:bg-slate-800/60 dark:border-violet-400/80' 
              : 'bg-white/40 border-slate-200/80 text-slate-700 hover:border-violet-300 dark:bg-slate-800/20 dark:border-slate-700/80 dark:text-slate-300 dark:hover:border-violet-500/50'}
            animate-fade-in-up
            `}
            style={{ 
              animationDelay: `${index * 100}ms`,
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(203 213 225 / 0.2) 1px, transparent 0)`,
              backgroundSize: `20px 20px`
            }}
          >
             <div className={`absolute inset-0 rounded-2xl border-2 transition-opacity duration-300 ${isSelected ? 'border-violet-500 opacity-100' : 'border-transparent opacity-0 group-hover:opacity-100'}`}
                style={{
                    background: `radial-gradient(400px circle at 50% 100%, rgba(124, 58, 237, 0.3), transparent 40%)`
                }}
             />
            <div className={`relative transition-colors drop-shadow-[0_2px_5px_rgba(124,58,237,0.2)] ${isSelected ? 'text-violet-500 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {mode.icon}
            </div>
            <h3 className="relative font-bold text-md text-slate-800 dark:text-slate-100">{mode.name}</h3>
            <p className="relative text-xs text-slate-500 dark:text-slate-400 mt-1">{mode.description}</p>
          </button>
        );
      })}
    </div>
  );
};