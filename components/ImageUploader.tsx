import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  disabled: boolean;
  title: string;
  description: string;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400 group-hover:text-violet-500 dark:text-slate-500 dark:group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled, title, description }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isOver: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(isOver);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };


  return (
    <div className="text-center p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">{description}</p>
      <div
        onClick={handleClick}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDrop={handleDrop}
        className={`group relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center cursor-pointer bg-slate-100/50 dark:bg-slate-800/20 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-white/50 dark:hover:bg-slate-800/40 transition-all duration-300
        ${isDragging ? 'border-violet-400 dark:border-violet-500 bg-white/50 dark:bg-slate-800/40 ring-4 ring-violet-500/20' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}
        `}
        style={{
            backgroundImage: `radial-gradient(rgb(203 213 225 / 0.3) 1px, transparent 1px)`,
            backgroundSize: `16px 16px`
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
        <UploadIcon />
        <p className="mt-4 font-semibold text-slate-700 dark:text-slate-300">
            Click to upload or drag and drop
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">PNG, JPG, or WEBP. 10MB max.</p>
      </div>
    </div>
  );
};