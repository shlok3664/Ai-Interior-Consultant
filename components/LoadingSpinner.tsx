import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
    texts: string[];
}

const DesignerSpinnerIcon = () => (
    <div className="relative w-16 h-16 mb-4">
        {/* Spinning outer circle */}
        <svg className="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle
                className="stroke-current text-indigo-200 dark:text-indigo-500/30"
                cx="16" cy="16" r="14" fill="none" strokeWidth="3"
            ></circle>
            <circle
                className="stroke-current text-indigo-500 dark:text-indigo-400"
                cx="16" cy="16" r="14" fill="none" strokeWidth="3"
                strokeDasharray="80" strokeDashoffset="60"
            ></circle>
        </svg>
        {/* Static house icon in the middle */}
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full p-3 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    </div>
);

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (texts.length <= 1) return;

    const intervalId = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setIndex(prevIndex => (prevIndex + 1) % texts.length);
        setIsFading(false);
      }, 300); // Corresponds to the fade-out duration
    }, 2500); // Total time per text including fade

    return () => clearInterval(intervalId);
  }, [texts.length]);

  return (
    <div className="absolute inset-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg transition-opacity duration-300">
      <DesignerSpinnerIcon />
      <p 
        className={`text-indigo-600 dark:text-indigo-300 font-semibold text-center px-4 transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
      >
        {texts[index] || 'Processing...'}
      </p>
    </div>
  );
};