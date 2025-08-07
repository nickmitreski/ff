import React, { useState, useEffect, memo } from 'react';
import { AppContentProps } from '../../../data/appData.tsx';
import { posthog } from '../../../lib/posthog';
import MobileRestrictionPopup from './MobileRestrictionPopup';

interface GameLauncherProps extends AppContentProps {
  gameUrl: string;
  gameName: string;
}

const GameLauncher: React.FC<GameLauncherProps> = ({ gameUrl, gameName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobilePopup, setShowMobilePopup] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    
    // Check if mobile on mount
    if (isMobile) {
      setShowMobilePopup(true);
      return;
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  useEffect(() => {
    // Don't proceed with game loading if mobile
    if (isMobile) {
      return;
    }
    
    // Track game launch with PostHog
    posthog.capture('game_launched', { game: gameName, url: gameUrl });
    
    // Simulate loading time with progress
    const totalSteps = 10;
    let currentStep = 0;
    
    const loadingInterval = setInterval(() => {
      currentStep++;
      setLoadingProgress(Math.floor((currentStep / totalSteps) * 100));
      
      if (currentStep >= totalSteps) {
        clearInterval(loadingInterval);
        setIsLoading(false);
        
        // Track game loaded
        posthog.capture('game_loaded', { game: gameName });
      }
    }, 200);

    return () => clearInterval(loadingInterval);
  }, [gameName, gameUrl, isMobile]);

  const handleIframeError = () => {
    setError(`Failed to load ${gameName}. Please try again later.`);
    setIsLoading(false);
    
    // Track error with PostHog
    posthog.capture('game_load_error', { game: gameName, url: gameUrl });
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setLoadingProgress(0);
    
    // Simulate loading again
    const totalSteps = 10;
    let currentStep = 0;
    
    const loadingInterval = setInterval(() => {
      currentStep++;
      setLoadingProgress(Math.floor((currentStep / totalSteps) * 100));
      
      if (currentStep >= totalSteps) {
        clearInterval(loadingInterval);
        setIsLoading(false);
      }
    }, 200);
    
    // Track retry with PostHog
    posthog.capture('game_load_retry', { game: gameName });
  };

  // Show mobile restriction popup
  if (showMobilePopup) {
    return <MobileRestrictionPopup onClose={() => setShowMobilePopup(false)} />;
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000080',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          zIndex: 10
        }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid #c0c0c0',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }} />
          <div>Loading {gameName}...</div>
          <div style={{
            width: '80%',
            height: '20px',
            backgroundColor: '#000040',
            border: '1px solid #ffffff',
            marginTop: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${loadingProgress}%`,
              backgroundColor: '#00aa00',
              transition: 'width 0.2s'
            }} />
          </div>
          <div style={{ marginTop: '10px' }}>{loadingProgress}%</div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {error ? (
        <div style={{
          padding: '20px',
          backgroundColor: '#c0c0c0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}>
          <div style={{
            backgroundColor: 'white',
            border: '2px solid',
            borderColor: '#808080 #ffffff #ffffff #808080',
            padding: '20px',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '20px', color: 'red' }}>
              {error}
            </div>
            <button 
              className="win95-button"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <iframe
          src={gameUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#000'
          }}
          title={gameName}
          onError={handleIframeError}
          allow="fullscreen"
        />
      )}
    </div>
  );
};

export default memo(GameLauncher);