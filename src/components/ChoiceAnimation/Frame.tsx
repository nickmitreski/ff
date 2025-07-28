import { useState, useEffect, memo } from 'react';
import { Card, CardContent } from '../../components/ui/card';

interface FrameProps {
  onYearSelect: (year: '1996' | '2025') => void;
  onYearHover?: (year: '1996' | '2025') => void;
}

export const Frame = memo(({ onYearSelect, onYearHover }: FrameProps): JSX.Element => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTransitionEnd = () => {
    if (!isZoomed) {
      setIsTransitioning(false);
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
        setShowButtons(true);
      }, 300); // Delay to ensure animation completes
    }
  };

  const handlePowerClick = () => {
    setIsZoomed(!isZoomed);
    setIsTransitioning(true);
    setShowButtons(false);
  };

  if (isMobile) {
    // Mobile choice landing screen using uploaded image
    const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const y = event.clientY - rect.top;
      
      // 2007 section (top) - covers full width, 240px from top, 180px height
      if (y >= 240 && y <= 420) {
        onYearSelect('1996'); // 1996 maps to 2007 iPhone experience
      }
      // 2025 section (bottom) - covers full width, 500px from top, 200px height
      else if (y >= 500 && y <= 700) {
        onYearSelect('2025');
      }
    };

    return (
      <section className="w-screen h-screen flex flex-col justify-center items-center bg-black">
        <div className="relative w-full h-full cursor-pointer" onClick={handleImageClick}>
          {/* Try to load the uploaded image first */}
          <img 
            src="/mobile_choice.png" 
            alt="Choose your experience - click on the year to select" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image fails to load, hide it and show the CSS fallback
              e.currentTarget.style.display = 'none';
              const fallback = document.getElementById('mobile-choice-fallback');
              if (fallback) fallback.style.display = 'block';
            }}
          />
          
          {/* CSS Fallback - shows the same design using CSS */}
          <div 
            id="mobile-choice-fallback"
            className="w-full h-full relative hidden"
            style={{
              background: 'linear-gradient(to bottom, #d3d3d3 0%, #d3d3d3 50%, #000000 50%, #000000 100%)'
            }}
          >
            {/* Instructional text */}
            <div className="absolute top-8 left-0 right-0 text-center z-10">
              <p className="text-black text-lg font-medium">click on the year to choose your experience</p>
            </div>
            
            {/* 2007 Section (Top) */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-8xl font-bold text-black cursor-pointer hover:opacity-80 transition-opacity">
                2007
              </div>
            </div>
            
            {/* Torn paper effect */}
            <div className="absolute top-1/2 left-0 right-0 h-8 bg-white" 
                 style={{
                   clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 80%, 5% 60%, 10% 80%, 15% 40%, 20% 80%, 25% 20%, 30% 80%, 35% 60%, 40% 80%, 45% 30%, 50% 80%, 55% 50%, 60% 80%, 65% 40%, 70% 80%, 75% 20%, 80% 80%, 85% 60%, 90% 80%, 95% 30%, 100% 80%, 100% 100%, 0% 100%)'
                 }}>
            </div>
            
            {/* 2025 Section (Bottom) */}
            <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
              <div className="text-8xl font-bold cursor-pointer hover:opacity-80 transition-opacity">
                <span style={{color: '#FF69B4'}}>2</span>
                <span style={{color: '#87CEEB'}}>0</span>
                <span style={{color: '#FFD700'}}>2</span>
                <span style={{color: '#9370DB'}}>5</span>
              </div>
              {/* Reflection effect */}
              <div className="text-8xl font-bold opacity-30 transform scale-y-[-0.3] translate-y-[-20px]">
                <span style={{color: '#FF69B4'}}>2</span>
                <span style={{color: '#87CEEB'}}>0</span>
                <span style={{color: '#FFD700'}}>2</span>
                <span style={{color: '#9370DB'}}>5</span>
              </div>
            </div>
          </div>
          
          {/* Invisible Click Areas - Transparent but functional */}
          <div className="absolute inset-0 z-20">
            {/* 2007 Click Area - Transparent */}
            <div 
              className="absolute"
              style={{
                left: '0px',
                top: '240px',
                width: '100%',
                height: '180px',
                backgroundColor: 'transparent',
                pointerEvents: 'auto'
              }}
              onMouseEnter={() => onYearHover?.('1996')}
            />
            
            {/* 2025 Click Area - Transparent */}
            <div 
              className="absolute"
              style={{
                left: '0px',
                top: '500px',
                width: '100%',
                height: '200px',
                backgroundColor: 'transparent',
                pointerEvents: 'auto'
              }}
              onMouseEnter={() => onYearHover?.('2025')}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full md:w-full md:h-auto w-screen h-screen">
      <div
        className={`relative w-full md:h-[791px] h-screen bg-cover bg-center transition-transform duration-1000 ease-in-out ${
          isZoomed ? 'md:scale-150 scale-110' : 'md:scale-100 scale-95'
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        <Card className="relative w-full h-full border-0">
          <CardContent className="p-0 h-full">
            {/* TV Screen Background */}
            <div 
              className={`absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] md:w-[640px] md:h-[480px] w-[90vw] h-auto max-w-[640px] max-h-[480px] transition-colors duration-300 ${
                isZoomed && !isTransitioning ? 'bg-white' : 'bg-black'
              }`}
              style={{
                zIndex: isTransitioning ? 2 : 1,
                backgroundColor: isZoomed && !isTransitioning ? '#f0f0d0' : 'black',
                position: 'absolute',
                aspectRatio: '4/3',
              }}
            >
              {/* Vignette Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxShadow: 'inset 0 0 100px 50px rgba(0, 0, 0, 0.8)',
                  zIndex: 2,
                }}
              />

              {/* Animation Layer */}
              {isTransitioning && (
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${isZoomed ? '/turn_on.gif' : '/turn_off.gif'})`,
                    mixBlendMode: 'screen',
                    zIndex: 2
                  }}
                />
              )}
            </div>

            {/* Mobile View Text Instruction - Only visible on mobile */}
            <div className="absolute top-[30%] left-0 right-0 text-center z-10 md:hidden">
              <p className="text-white text-xl">press screen to turn on</p>
            </div>

            {/* Buttons Container */}
            <div className={`absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] w-[640px] h-[480px] flex items-center justify-center gap-12 transition-opacity duration-300 ${showButtons ? 'opacity-100' : 'opacity-0'}`} style={{ zIndex: showButtons ? 5 : 1 }}>
              <div 
                className="cursor-pointer flex items-center justify-center"
                onClick={() => onYearSelect('1996')}
                onMouseEnter={() => onYearHover?.('1996')}
                style={{ width: 'auto', height: 'auto' }}
              >
                <img src="/1996.webp" alt="1996" style={{ width: '150px', height: 'auto' }} />
              </div>
              <div 
                className="cursor-pointer flex items-center justify-center"
                onClick={() => onYearSelect('2025')}
                onMouseEnter={() => onYearHover?.('2025')}
                style={{ width: 'auto', height: 'auto' }}
              >
                <img src="/2025.webp" alt="2025" style={{ width: '150px', height: 'auto' }} />
              </div>
            </div>

            {/* Background Image Layer */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center md:w-full md:h-full w-screen h-screen"
              style={{ 
                backgroundImage: "url(/bg.webp)",
                zIndex: 3
              }}
            />

            {/* Power Button Container */}
            <div 
              className="absolute top-[50%] left-[50%] transform translate-y-[180px] w-[256px] h-[40px] hover:cursor-pointer"
              style={{ zIndex: 4 }}
              onClick={handlePowerClick}
            >
              {!isZoomed && (
                <img 
                  src="/power.webp"
                  alt="Power On Button"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '0px', 
                    width: '175%',
                    height: '175%',
                    objectFit: 'contain',
                    transform: 'translateY(-60%)',
                  }}
                  className="pulsating-power-button"
                />
              )}
            </div>

            <style>{`
              @keyframes pulsate {
                0% { transform: scale(1) translateY(-60%); }
                50% { transform: scale(1.10) translateY(-60%); } /* Scale up by 10 percent */
                100% { transform: scale(1) translateY(-60%); }
              }

              .pulsating-power-button {
                animation: pulsate 1.5s ease-in-out infinite;
              }
              
              /* Mobile-specific styles */
              @media (max-width: 768px) {
                .pulsating-power-button {
                  width: 200% !important;
                  height: 200% !important;
                }
              }

              button, [role="button"] {
                cursor: pointer;
              }
              
              /* Ensure the TV screen is fully visible on mobile */
              @media (max-width: 640px) {
                .pulsating-power-button {
                  width: 220% !important;
                  height: 220% !important;
                }
              }
              
              /* Make sure the background image covers the entire screen on mobile */
              @media (max-width: 480px) {
                section {
                  width: 100vw;
                  overflow-x: hidden;
                }
              }
            `}</style>
          </CardContent>
        </Card>
      </div>
    </section>
  );
});