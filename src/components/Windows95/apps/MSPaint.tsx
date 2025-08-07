import React, { memo, useState, useEffect } from 'react';

const MSPaint: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Show loading state briefly, then allow iframe to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loadError) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c0c0c0',
        color: '#000080',
        fontSize: '14px'
      }}>
        Failed to load MS Paint. Please try again.
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#c0c0c0'
    }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#000080',
          fontSize: '14px',
          zIndex: 10
        }}>
          Loading MS Paint...
        </div>
      )}
      <iframe 
        src="/jspaint-main/index.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: '#c0c0c0',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        title="JS Paint"
        allow="fullscreen"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setLoadError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default memo(MSPaint);