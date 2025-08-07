import React from 'react';

interface LockScreenBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
}

const LockScreenBackground: React.FC<LockScreenBackgroundProps> = ({ className = '', style }) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full z-0 ${className}`}
      style={{
        background: 'linear-gradient(to bottom, #20273c 60%, #0f1120 100%)',
        ...style
      }}
    />
  );
};

export default LockScreenBackground; 