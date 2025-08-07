import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClockHeader from './ClockHeader';

interface ClockAppProps {
  onClose: () => void;
}

const ClockApp: React.FC<ClockAppProps> = ({ onClose }) => {
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
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate clock hand angles
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      <ClockHeader onClose={onClose} />
      
      <div className="flex-1 bg-black p-6 flex flex-col items-center justify-center">
        {/* Digital Time */}
        <div className="text-center mb-8">
          <div className="text-white text-4xl font-light mb-2">
            {formatTime(time)}
          </div>
          <div className="text-gray-400 text-lg">
            {formatDate(time)}
          </div>
        </div>

        {/* Analog Clock */}
        <div className="relative">
          <div className="clock-face w-64 h-64 relative">
            {/* Clock Numbers */}
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => {
              const angle = (hour / 12) * 360 - 90;
              const radius = 110;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              
              return (
                <div
                  key={hour}
                  className="absolute text-gray-700 font-semibold text-lg"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {hour}
                </div>
              );
            })}

            {/* Clock Hands */}
            {/* Hour Hand */}
            <div
              className="absolute top-1/2 left-1/2 w-1 h-16 bg-gray-800 rounded-full origin-bottom"
              style={{
                transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)`,
                transformOrigin: 'bottom center',
              }}
            />
            
            {/* Minute Hand */}
            <div
              className="absolute top-1/2 left-1/2 w-1 h-20 bg-gray-600 rounded-full origin-bottom"
              style={{
                transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)`,
                transformOrigin: 'bottom center',
              }}
            />
            
            {/* Second Hand */}
            <div
              className="absolute top-1/2 left-1/2 w-0.5 h-24 bg-red-500 rounded-full origin-bottom"
              style={{
                transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)`,
                transformOrigin: 'bottom center',
              }}
            />
            
            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClockApp; 