import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ImageComparatorProps {
  originalImage: string;
  generatedImage: string | null;
  isProcessing?: boolean;
}

const SliderIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
);

const Placeholder: React.FC = () => (
    <div className="w-full h-full bg-slate-100/30 dark:bg-slate-800/20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 rounded-lg min-h-[300px] text-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden relative"
    >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="relative mb-4">
             <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400 dark:text-slate-500">
                <path d="M12 2L2 7V21H22V7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                <path d="M22 7L12 12L2 7" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                <path d="M12 12V21" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                <path d="M17 15.5V12.5L19 14.5L17 16.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <animate attributeName="stroke-dasharray" from="0 20" to="20 20" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
                </path>
                 <path d="M5 16H9" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                     <animate attributeName="stroke-dasharray" from="0 8" to="8 8" dur="1.5s" repeatCount="indefinite" />
                     <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.5s" repeatCount="indefinite" />
                 </path>
            </svg>
        </div>
        <p className="mt-2 font-semibold text-slate-700 dark:text-slate-300">Your new design will appear here</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select a style above to begin the transformation.</p>
    </div>
);


export const ImageComparator: React.FC<ImageComparatorProps> = ({ originalImage, generatedImage, isProcessing }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    e.preventDefault();
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseUp = () => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDragging(false);
        }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDraggingRef.current) return;
        handleMove(e.touches[0].clientX);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMove]);

  if (!generatedImage) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full h-full min-h-[300px] flex items-center justify-center p-4 bg-slate-100/30 dark:bg-slate-800/20 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700">
          <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
        <Placeholder />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-full mx-auto aspect-[4/3] overflow-hidden rounded-2xl select-none shadow-xl border border-slate-200/80 dark:border-slate-700/80 animate-fade-in-up transition-all duration-300 ${isDragging ? 'cursor-ew-resize' : 'cursor-grab'} ${isProcessing ? 'ring-4 ring-violet-500/70 animate-pulse' : ''}`}
    >
      <div
        className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${generatedImage})` }}
        aria-label="AI Generated Image"
      ></div>
      
      <div
        className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat pointer-events-none"
        style={{ 
            backgroundImage: `url(${originalImage})`,
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` 
        }}
        aria-label="Original Image"
      ></div>

      <div
        className="absolute top-0 h-full w-1 bg-white/50 backdrop-blur-sm shadow-lg"
        style={{ left: `${sliderPosition}%`, cursor: 'ew-resize' }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-violet-500 to-rose-600 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/50 cursor-ew-resize transition-transform duration-200"
          style={{ transform: isDragging ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%) scale(1)'}}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className={`absolute inset-0 rounded-full bg-white/20 ${!isDragging ? 'animate-pulse' : ''}`}></div>
          <SliderIcon />
        </div>
      </div>
      
       <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full pointer-events-none backdrop-blur-sm tracking-wider uppercase">Original</div>
       <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full pointer-events-none backdrop-blur-sm tracking-wider uppercase">AI Generated</div>
    </div>
  );
};