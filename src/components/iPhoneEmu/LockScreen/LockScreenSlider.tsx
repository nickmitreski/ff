import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LockScreenSliderProps {
  onUnlock: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const SLIDER_WIDTH = 260;
const SLIDER_HEIGHT = 44;
const BUTTON_SIZE = 40;

const LockScreenSlider: React.FC<LockScreenSliderProps> = ({ onUnlock, className = '', style }) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Drag logic
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isUnlocking) return;
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    let x = clientX - rect.left - 2;
    x = Math.max(0, Math.min(x, SLIDER_WIDTH - BUTTON_SIZE));
    setDragX(x);
    if (x >= SLIDER_WIDTH - BUTTON_SIZE - 2) {
      setIsUnlocking(true);
      setTimeout(() => {
        onUnlock();
      }, 200);
    }
  };

  const handleDragEnd = () => {
    if (!isUnlocking) setDragX(0);
    setIsDragging(false);
  };

  // Click to fake swipe
  const handleClick = () => {
    setDragX(SLIDER_WIDTH - BUTTON_SIZE);
    setIsUnlocking(true);
    setTimeout(() => {
      onUnlock();
    }, 200);
  };

  return (
    <div
      ref={sliderRef}
      className={`relative w-full h-full rounded-full bg-white bg-opacity-20 border border-white border-opacity-30 shadow-inner overflow-hidden flex items-center select-none ${className}`}
      style={{
        width: SLIDER_WIDTH,
        height: SLIDER_HEIGHT,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        ...style,
      }}
      onMouseDown={handleDragStart}
      onMouseMove={isDragging ? handleDrag : undefined}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={isDragging ? handleDrag : undefined}
      onTouchEnd={handleDragEnd}
      onClick={handleClick}
    >
      {/* Draggable Button - perfectly centered vertically */}
      <motion.div
        className="absolute left-0 z-10 flex items-center justify-center"
        style={{ x: dragX, width: BUTTON_SIZE, height: BUTTON_SIZE, top: `calc(50% - 20px)`, borderRadius: 9999, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        animate={{
          background: 'linear-gradient(135deg, #f8f8f8 60%, #e0e0e0 100%)',
          border: '1.5px solid #fff',
          boxShadow: dragX > 0 ? '0 2px 8px rgba(0,0,0,0.18)' : '0 2px 8px rgba(0,0,0,0.10)'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onPointerDown={handleDragStart}
        onPointerMove={isDragging ? handleDrag : undefined}
        onPointerUp={handleDragEnd}
      >
        <div className="w-full h-full flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="10" fill="none" />
            <path d="M7 10h6m0 0l-2-2m2 2l-2 2" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>
      {/* Shimmering "slide to unlock" text */}
      <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="relative w-[180px] h-6 flex items-center justify-center">
          <span className="text-white text-[15px] font-light tracking-wide opacity-90" style={{textShadow: '0 1px 4px rgba(0,0,0,0.25)'}}>
            <span className="shimmer-text">slide to unlock</span>
          </span>
          <style>{`
            .shimmer-text {
              position: relative;
              background: linear-gradient(90deg, #fff 0%, #e0e0e0 40%, #fff 60%, #e0e0e0 100%);
              background-size: 200% 100%;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: shimmer 2.2s infinite linear;
            }
            @keyframes shimmer {
              0% { background-position: -100% 0; }
              100% { background-position: 100% 0; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default LockScreenSlider; 