import React from 'react';
import type { TrendReportData } from '../types';

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const elements = text.split('\n').map((line, i) => {
        line = line.trim();
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-4 mb-2 text-slate-800 dark:text-slate-100 pt-2 border-t border-slate-200/80 dark:border-slate-600/80 first:border-t-0 first:pt-0">{line.substring(3)}</h2>;
        if (line.startsWith('* ')) {
            return (
                <li key={i} className="flex items-start pl-2">
                    <span className="text-violet-500 dark:text-violet-400 mr-3 mt-1.5 text-xs">&#9670;</span>
                    <span>{line.substring(2)}</span>
                </li>
            );
        }
        if (line) return <p key={i} className="mb-2">{line}</p>;
        return null;
    });

    return <ul className="space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed list-none">{elements}</ul>;
};

interface TrendReportProps {
  report: TrendReportData;
  country: string;
}

export const TrendReport: React.FC<TrendReportProps> = ({ report, country }) => {
  return (
    <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 animate-fade-in-up mt-8">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">Interior Design Trends in {country}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">Visual Mood Board</h3>
            <img src={report.imageUrl} alt={`Mood board for ${country}`} className="w-full rounded-lg shadow-md border border-slate-200 dark:border-slate-600" />
        </div>
        <div className="lg:col-span-3">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">AI-Powered Analysis</h3>
            <div className="bg-slate-50/30 dark:bg-slate-700/20 p-4 rounded-lg border border-slate-200/80 dark:border-slate-600/80">
                 <SimpleMarkdown text={report.text} />
            </div>
        </div>
      </div>
    </div>
  );
};