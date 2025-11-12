import React from 'react';

interface VideoPlayerProps {
    src: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
    return (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Your Animated Scene</h2>
            <div className="aspect-video w-full">
                <video
                    key={src} // Important: force re-render when src changes
                    src={src}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full rounded-lg shadow-md border border-slate-200 dark:border-slate-700"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};
