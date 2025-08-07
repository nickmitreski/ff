import React, { useState, useEffect } from 'react';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="flex items-center justify-between px-2 py-1 bg-transparent text-white text-xs font-bold relative z-10" style={{height: '22px'}}>
      {/* Upside-down Signal Bars */}
      <div className="flex items-center space-x-1 min-w-[70px]">
        <div className="flex gap-0.5 items-end" style={{ transform: 'scaleY(-1)' }}>
          <div className="w-0.5 h-3 bg-white rounded-sm"></div>
          <div className="w-0.5 h-2.5 bg-white rounded-sm"></div>
          <div className="w-0.5 h-2 bg-white rounded-sm"></div>
          <div className="w-0.5 h-1.5 bg-white rounded-sm"></div>
        </div>
        <span className="text-xs ml-1">Telstra</span>
      </div>
      {/* Centered Time */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center font-normal text-xs tracking-wide" style={{width: '60px'}}>
        {formatTime(time)}
      </div>
      {/* Battery Only (old green style) */}
      <div className="flex items-center space-x-1 min-w-[70px] justify-end">
        <div className="relative w-4 h-2 border border-white rounded-sm">
          <div className="absolute top-0.5 left-0.5 w-3 h-1 bg-green-400 rounded-sm"></div>
          <div className="absolute top-0 right-0 w-0.5 h-2 bg-white rounded-r-sm"></div>
        </div>
        <span className="text-xs">100%</span>
      </div>
    </div>
  );
};

export default StatusBar;