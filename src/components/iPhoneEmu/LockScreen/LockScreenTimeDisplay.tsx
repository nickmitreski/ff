import React, { useState, useEffect } from 'react';

interface LockScreenTimeDisplayProps {
  className?: string;
  style?: React.CSSProperties;
}

const LockScreenTimeDisplay: React.FC<LockScreenTimeDisplayProps> = ({ className = '', style }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // 12-hour format, no AM/PM
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let displayHours = hours % 12 || 12;
    let displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`absolute top-16 left-1/2 -translate-x-1/2 w-[300px] flex flex-col items-center justify-center ${className}`} style={style}>
      <div className="text-[70px] font-thin tracking-tight text-white drop-shadow-lg select-none" style={{fontFamily: 'inherit', letterSpacing: '-2px', lineHeight: 1}}>
        {formatTime(currentTime)}
      </div>
      <div className="text-lg font-light text-white/90 tracking-wide drop-shadow-md select-none mt-1" style={{fontFamily: 'inherit', letterSpacing: '0.5px'}}>
        {formatDate(currentTime)}
      </div>
    </div>
  );
};

export default LockScreenTimeDisplay; 