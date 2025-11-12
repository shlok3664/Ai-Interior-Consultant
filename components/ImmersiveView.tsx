import React, { useRef, useState } from 'react';

interface ImmersiveViewProps {
  imageUrl: string;
}

const MAX_ROTATION = 8; // Max rotation in degrees

export const ImmersiveView: React.FC<ImmersiveViewProps> = ({ imageUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    gradientX: 50,
    gradientY: 50,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    const mouseX = x - width / 2;
    const mouseY = y - height / 2;
    
    const rotateY = (mouseX / (width / 2)) * MAX_ROTATION;
    const rotateX = (-mouseY / (height / 2)) * MAX_ROTATION;
    
    const gradientX = (x / width) * 100;
    const gradientY = (y / height) * 100;

    setTransform({ rotateX, rotateY, gradientX, gradientY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, gradientX: 50, gradientY: 50 });
  };

  const { rotateX, rotateY, gradientX, gradientY } = transform;
  
  const cardStyle: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`,
    transition: 'transform 0.1s ease-out',
  };

  const glowStyle: React.CSSProperties = {
    backgroundImage: `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 40%)`,
    transition: 'background-image 0.1s ease-out',
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-auto max-h-[500px] aspect-video rounded-lg shadow-md animate-fade-in-up"
      style={{ perspective: '1000px' }}
    >
      <div 
        className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl"
        style={cardStyle}
      >
        <img
          src={imageUrl}
          alt="Immersive 3D View"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 w-full h-full opacity-80 mix-blend-soft-light"
          style={glowStyle}
        />
        <div className="absolute inset-0 border-2 border-white/10 rounded-lg" />
      </div>
    </div>
  );
};