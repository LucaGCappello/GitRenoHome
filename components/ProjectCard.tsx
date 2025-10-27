'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  location: string;
  beforeImage: string;
  afterImage: string;
}

export default function ProjectCard({ title, location, beforeImage, afterImage }: ProjectCardProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      updatePosition(e.touches[0].clientX);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition(prev => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition(prev => Math.min(100, prev + 5));
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <div
        ref={containerRef}
        className="relative h-64 select-none"
      >
        <div className="absolute inset-0">
          <Image
            src={beforeImage}
            alt={`${title} before`}
            fill
            className="object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={afterImage}
            alt={`${title} after`}
            fill
            className="object-cover"
          />
        </div>
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-blue-600"
            onMouseDown={handleMouseDown}
            onTouchStart={() => setIsDragging(true)}
            onKeyDown={handleKeyDown}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(sliderPosition)}
            aria-label={`Before and after slider for ${title}`}
            tabIndex={0}
          >
            <div className="flex gap-0.5">
              <div className="w-0.5 h-5 bg-slate-400"></div>
              <div className="w-0.5 h-5 bg-slate-400"></div>
            </div>
          </button>
        </div>
        <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded text-xs font-semibold">
          Before
        </div>
        <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs font-semibold">
          After
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-slate-600">{location}</p>
      </div>
    </div>
  );
}
