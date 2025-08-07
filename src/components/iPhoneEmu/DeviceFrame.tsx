import React from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
  onHomePress?: () => void;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, onHomePress }) => {
  const handleHomePress = () => {
    // Dispatch custom event for folder components to listen to
    document.dispatchEvent(new CustomEvent('homeButtonPressed'));
    // Call the original onHomePress handler
    if (onHomePress) {
      onHomePress();
    }
  };

  return (
    <div className="relative w-96 h-[750px] mx-auto">
      {/* Outer frame */}
      <div className="w-full h-full bg-black rounded-[3rem] p-3 shadow-2xl relative z-0">
        {/* Camera Sensor */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -translate-x-4 w-2 h-2 bg-gray-900 rounded-full z-20" />
        {/* Speaker */}
        <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-gray-700 rounded-sm z-20" />
        {/* Screen area (children) - NO border radius here! */}
        <div className="w-full h-full bg-black overflow-visible relative flex flex-col" style={{ borderRadius: 0 }}>
          {/* Earpiece area */}
          <div className="h-16 bg-transparent flex items-center justify-center z-50">
            <div className="w-12 h-1 bg-gray-700 rounded-full" />
          </div>
          {/* Screen content */}
          <div className="flex-1 relative flex flex-col">
            {children}
          </div>
          {/* Chin/home button */}
          <div className="relative bg-black h-28 flex items-center justify-center">
            <button
              className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-600 shadow-lg"
              style={{ zIndex: 40 }}
              onClick={handleHomePress}
            >
              {/* White square for iPhone 1st gen */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="6" height="6" rx="1" fill="white" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceFrame; 