import React, { useState } from 'react';

interface PriceAnalyzerProps {
  onAnalyze: (location: string) => void;
  disabled: boolean;
}

const AnalyzeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);


export const PriceAnalyzer: React.FC<PriceAnalyzerProps> = ({ onAnalyze, disabled }) => {
  const [location, setLocation] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim() && !disabled) {
      onAnalyze(location.trim());
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Estimate the Budget</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Enter your city or country to get an approximate cost for the items in your new design.</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-grow">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={disabled}
              placeholder="e.g., New York, USA or just Italy"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 transition-shadow bg-white/80 shadow-sm dark:bg-slate-700/80 dark:border-slate-600 dark:text-slate-100 dark:focus:ring-violet-400 dark:placeholder-slate-400"
              aria-label="Enter location for price analysis"
            />
        </div>
        <button
            type="submit"
            disabled={disabled || !location.trim()}
            className="flex-shrink-0 bg-gradient-to-br from-violet-500 to-rose-600 text-white rounded-xl px-5 py-3 font-semibold shadow-md hover:from-violet-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <AnalyzeIcon />
          Analyze Prices
        </button>
      </form>
    </div>
  );
};