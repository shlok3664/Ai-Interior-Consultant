import React, { useState } from 'react';
import { COUNTRIES } from '../constants';

interface CountrySelectorProps {
  onSelectCountry: (country: string) => void;
  disabled: boolean;
}

const AnalyzeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);


export const CountrySelector: React.FC<CountrySelectorProps> = ({ onSelectCountry, disabled }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCountry && !disabled) {
      onSelectCountry(selectedCountry);
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Explore Global Design Trends</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Select a country to generate an AI-powered analysis of its current interior design landscape.</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-grow">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              disabled={disabled}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 transition-shadow bg-white/80 shadow-sm appearance-none dark:bg-slate-700/80 dark:border-slate-600 dark:text-slate-100 dark:focus:ring-violet-400"
              aria-label="Select a country"
            >
              <option value="" disabled>-- Select a Country --</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
        <button
            type="submit"
            disabled={disabled || !selectedCountry}
            className="flex-shrink-0 bg-gradient-to-br from-violet-500 to-rose-600 text-white rounded-xl px-5 py-3 font-semibold shadow-md hover:from-violet-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <AnalyzeIcon />
          Analyze Trends
        </button>
      </form>
    </div>
  );
};