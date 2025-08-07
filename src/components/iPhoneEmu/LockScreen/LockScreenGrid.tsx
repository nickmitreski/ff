import React from 'react';

interface LockScreenGridProps {
  className?: string;
  style?: React.CSSProperties;
}

const LockScreenGrid: React.FC<LockScreenGridProps> = ({ className = '', style }) => {
  return (
    <div 
      className={`absolute inset-0 opacity-5 pointer-events-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        ...style,
      }}
    />
  );
};

export default LockScreenGrid; 