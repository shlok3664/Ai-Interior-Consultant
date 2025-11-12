import React, { useState } from 'react';
import { DESIGN_STYLES } from '../constants';
import type { DesignStyle, Palette } from '../types';

interface StyleCarouselProps {
  onStyleSelect: (style: DesignStyle) => void;
  onCustomStyleSubmit: (prompt: string) => void;
  disabled: boolean;
  selectedStyleName?: string | null;
  activePalette: Palette | null;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zM10 14a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zM3.5 10a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM14 10a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM6.061 6.061a.5.5 0 01.707 0l1.414 1.414a.5.5 0 01-.707.707L6.06 6.768a.5.5 0 010-.707zM12.515 12.515a.5.5 0 01.707 0l1.414 1.414a.5.5 0 01-.707.707l-1.414-1.414a.5.5 0 010-.707zM6.06 13.939a.5.5 0 010-.707l1.414-1.414a.5.5 0 01.707.707L6.768 13.94a.5.5 0 01-.707 0zM12.515 7.485a.5.5 0 010-.707l1.414-1.414a.5.5 0 01.707.707l-1.414 1.414a.5.5 0 01-.707 0z" clipRule="evenodd" />
    </svg>
);


export const StyleCarousel: React.FC<StyleCarouselProps> = ({ onStyleSelect, onCustomStyleSubmit, disabled, selectedStyleName, activePalette }) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSelect = (style: DesignStyle) => {
    if (!disabled) {
      onStyleSelect(style);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && customPrompt.trim()) {
      onCustomStyleSubmit(customPrompt.trim());
    }
  };

  return (
    <div className="relative">
      {activePalette && (
        <div className="mb-6 p-4 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700/50 rounded-xl text-center animate-fade-in-up">
            <p className="text-sm font-semibold text-violet-800 dark:text-violet-200">Active Color Palette:</p>
            <div className="flex justify-center items-center gap-2 mt-2">
                {activePalette.colors.map(color => (
                    <div key={color} className="w-6 h-6 rounded-full shadow-inner border-2 border-white/50 dark:border-black/20" style={{ backgroundColor: color }} title={color} />
                ))}
            </div>
            <p className="text-xs text-violet-600 dark:text-violet-400 mt-2">Designs will be generated using these colors.</p>
        </div>
      )}
      <div className="flex space-x-4 overflow-x-auto py-2 -mx-2 px-2 scrollbar-thin">
        {DESIGN_STYLES.map((style) => {
          const isSelected = selectedStyleName === style.name;
          return (
            <div
              key={style.name}
              onClick={() => handleSelect(style)}
              className={`flex-shrink-0 w-48 p-4 rounded-xl border text-center cursor-pointer transition-all duration-300 transform 
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl active:scale-[1.02]'}
              ${isSelected
                ? 'bg-violet-50 text-violet-700 shadow-lg scale-105 ring-2 ring-offset-2 ring-violet-500 border-transparent dark:bg-violet-900/50 dark:text-violet-300 dark:ring-violet-400' 
                : 'bg-white/50 border-slate-200 shadow-sm text-slate-700 hover:shadow-md dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'}
              `}
            >
              <h3 className={`font-bold text-lg flex items-center justify-center ${isSelected ? 'text-violet-700 dark:text-violet-300' : ''}`}>
                {isSelected && <CheckIcon />}
                {style.name}
              </h3>
            </div>
          )
        })}
      </div>

       <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 text-center mb-2">Or Describe Your Own Style</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4 max-w-md mx-auto">Get creative! Describe any aesthetic you can imagine, from "Vampire Chic" to "Underwater Atlantis".</p>
            <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
                <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., 'A cozy, cluttered room in the style of a wizard's study, with lots of books and magical artifacts.'"
                    disabled={disabled}
                    className="flex-grow w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 transition-shadow resize-none bg-white/80 shadow-sm dark:bg-slate-700/80 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:ring-violet-400"
                    rows={3}
                    aria-label="Custom style prompt"
                />
                <button
                    type="submit"
                    disabled={disabled || !customPrompt.trim()}
                    className="flex-shrink-0 bg-gradient-to-br from-violet-500 to-rose-600 text-white rounded-xl px-5 py-3 font-semibold shadow-md hover:from-violet-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                    <SparkleIcon />
                    Generate
                </button>
            </form>
        </div>
    </div>
  );
};