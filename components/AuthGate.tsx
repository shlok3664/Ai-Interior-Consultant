import React from 'react';

interface AuthGateProps {
  onSelectKey: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onSelectKey }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="max-w-md w-full text-center bg-slate-100 dark:bg-slate-700 p-8 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-600/50">
        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight mb-4">
          <span className="font-extrabold bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent">AI</span> Interior Design Consultant
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          To get started, please select your Google AI Studio API key. Your key powers the creative features of this application.
        </p>
        <div className="relative group">
           <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-2/3 bg-gradient-to-r from-violet-500 to-rose-500 rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            <button
              onClick={onSelectKey}
              className="relative w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-slate-800 transition-all"
            >
              Select API Key
            </button>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
          For information on billing and usage, refer to the{' '}
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-violet-500 hover:underline dark:text-violet-400"
          >
            official documentation
          </a>.
        </p>
      </div>
    </div>
  );
};