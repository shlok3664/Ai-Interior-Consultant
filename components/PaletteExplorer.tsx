// Fix: Implemented PaletteExplorer component.
import React, { useState } from 'react';
import type { Palette } from '../types';
import { ImmersiveView } from './ImmersiveView';

interface PaletteExplorerProps {
  sourceImage: string;
  palette: Palette;
  onApplyPalette: (palette: Palette) => void;
  onGenerateComplementary: (color: string) => void;
  disabled: boolean;
}

const CopyIcon: React.FC<{ copied: boolean }> = ({ copied }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-all duration-200 ${copied ? 'text-green-400 scale-125' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {copied ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      )}
    </svg>
);

const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>;
const SparkleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm6 0a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 011-1zM9 9a1 1 0 011-1h1v1a1 1 0 01-2 0V9z" /><path fillRule="evenodd" d="M5 12a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0v-1H3a1 1 0 010-2h1v-1a1 1 0 011-1zM11 12a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 010-2h1v-1a1 1 0 011-1z" clipRule="evenodd" /></svg>;

const ColorBlock: React.FC<{ color: string; isLocked: boolean; onLock: () => void; disabled: boolean; }> = ({ color, isLocked, onLock, disabled }) => {
    const [copied, setCopied] = React.useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(color);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group w-full aspect-square rounded-lg flex flex-col items-end justify-center p-2 text-white font-mono text-sm shadow-md" style={{ backgroundColor: color }}>
            <div className="absolute inset-0 w-full h-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                <button onClick={copyToClipboard} className="w-8 h-8 flex items-center justify-center bg-black/30 rounded-full hover:bg-black/50" title="Copy"><CopyIcon copied={copied} /></button>
                <button onClick={onLock} disabled={disabled} className="w-8 h-8 flex items-center justify-center bg-black/30 rounded-full hover:bg-black/50 disabled:opacity-50" title="Lock Color"><LockIcon /></button>
            </div>
            {isLocked && <div className="absolute top-2 left-2 text-white"><LockIcon /></div>}
            <span className="absolute bottom-2 right-2 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm text-xs">{color}</span>
        </div>
    );
};

const RoomPreview: React.FC<{ wallColor: string }> = ({ wallColor }) => (
    <svg viewBox="0 0 200 150" className="w-full h-full rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 shadow-inner">
        {/* Floor */}
        <path d="M0 110 L200 110 L200 150 L0 150 Z" fill="#D1B48C" />
        <path d="M0 110 L200 110" stroke="#000" strokeOpacity="0.1" strokeWidth="0.5"/>
        {/* Back Wall */}
        <path id="wall" d="M0 0 L200 0 L200 110 L0 110 Z" fill={wallColor} style={{ transition: 'fill 0.2s ease-in-out' }}/>
         {/* Skirting */}
        <path d="M0 108 L200 108 L200 112 L0 112 Z" fill="#FFFFFF" fillOpacity="0.8"/>
        {/* Couch */}
        <rect x="50" y="80" width="100" height="30" rx="3" fill="#A9A9A9" />
        <rect x="55" y="75" width="90" height="15" rx="3" fill="#C0C0C0" />
        {/* Picture Frame */}
        <rect x="80" y="30" width="40" height="30" fill="#EFEFEF" stroke="#444" strokeWidth="1"/>
        <rect x="85" y="35" width="30" height="20" fill="#B0E0E6" />
        {/* Plant */}
        <path d="M160 100 C 158 90, 162 90, 160 80" stroke="#228B22" strokeWidth="1.5" fill="none"/>
        <circle cx="160" cy="80" r="5" fill="#32CD32"/>
        <path d="M155 110 L165 110 L160 100 Z" fill="#8B4513"/>
    </svg>
);


export const PaletteExplorer: React.FC<PaletteExplorerProps> = ({ sourceImage, palette, onApplyPalette, onGenerateComplementary, disabled }) => {
  if (!palette) return null;

  const [hoverColor, setHoverColor] = useState<string>('#f1f5f9');
  const [lockedColor, setLockedColor] = useState<string | null>(null);

  return (
    <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                <ImmersiveView imageUrl={sourceImage} />
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Extracted Palette</h2>
                    <p className="font-semibold text-lg text-slate-500 dark:text-slate-400">{palette.name}</p>
                </div>
            </div>
            <div className="space-y-4 flex flex-col">
                <div className="flex-grow">
                    <RoomPreview wallColor={hoverColor} />
                </div>
                <div className="grid grid-cols-5 gap-3">
                    {palette.colors.map((color, index) => (
                    <div 
                        key={index} 
                        className="animate-fade-in-up" 
                        style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
                        onMouseEnter={() => setHoverColor(color)}
                        onMouseLeave={() => setHoverColor('#f1f5f9')}
                    >
                        <ColorBlock color={color} isLocked={lockedColor === color} onLock={() => setLockedColor(color)} disabled={disabled} />
                    </div>
                    ))}
                </div>
                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-700/80 space-y-3">
                    <div className="flex gap-3">
                        <button
                            onClick={() => onGenerateComplementary(lockedColor!)}
                            disabled={!lockedColor || disabled}
                            className="w-full flex items-center justify-center bg-slate-700 text-white rounded-xl px-4 py-3 font-semibold shadow-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 dark:bg-slate-600 dark:hover:bg-slate-500 dark:disabled:bg-slate-500"
                        >
                            <SparkleIcon />
                            <span className="ml-2">New Palette from Locked Color</span>
                        </button>
                    </div>
                    <button
                        onClick={() => onApplyPalette(palette)}
                        disabled={disabled}
                        className="w-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-rose-600 text-white rounded-xl px-5 py-3 font-semibold shadow-md hover:from-violet-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all transform hover:scale-105 active:scale-95"
                    >
                        Use This Palette to Redesign
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};