import React, { useState } from 'react';

interface VideoGeneratorProps {
    imageSrc: string;
    onGenerate: (prompt: string, aspectRatio: '16:9' | '9:16') => void;
    disabled: boolean;
}

const AspectRatioIcon: React.FC<{ ratio: '16:9' | '9:16' }> = ({ ratio }) => {
    const isLandscape = ratio === '16:9';
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x={isLandscape ? "3" : "7"} y={isLandscape ? "7" : "3"} width={isLandscape ? "18" : "10"} height={isLandscape ? "10" : "18"} rx="2" ry="2" />
        </svg>
    );
};

const GenerateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ imageSrc, onGenerate, disabled }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !disabled) {
            onGenerate(prompt, aspectRatio);
        }
    };

    return (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Image Preview */}
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Your Starting Image</h3>
                    <img src={imageSrc} alt="Starting frame for video" className="rounded-lg shadow-md w-full aspect-video object-cover border border-slate-200 dark:border-slate-700" />
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="prompt" className="block text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">1. Describe the Animation</label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'A gentle breeze blows through the curtains, sunlight streams in, and the plant leaves sway softly.'"
                            disabled={disabled}
                            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 transition-shadow resize-none bg-white/80 shadow-sm dark:bg-slate-700/80 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:ring-violet-400"
                            rows={4}
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">2. Choose Aspect Ratio</h3>
                        <div className="flex gap-3">
                            {(['16:9', '9:16'] as const).map(ratio => (
                                <button
                                    key={ratio}
                                    type="button"
                                    onClick={() => setAspectRatio(ratio)}
                                    disabled={disabled}
                                    className={`flex-1 flex items-center justify-center p-3 rounded-lg border text-sm font-semibold transition-all duration-200 ${
                                        aspectRatio === ratio
                                            ? 'bg-violet-600 text-white border-transparent shadow-md'
                                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-600'
                                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                                >
                                    <AspectRatioIcon ratio={ratio} />
                                    {ratio === '16:9' ? 'Landscape' : 'Portrait'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={disabled || !prompt.trim()}
                            className="w-full flex-shrink-0 bg-gradient-to-br from-violet-500 to-rose-600 text-white rounded-xl px-5 py-3 font-semibold shadow-md hover:from-violet-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
                        >
                            <GenerateIcon />
                            Generate Video
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
