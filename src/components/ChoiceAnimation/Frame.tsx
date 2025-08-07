import { useState, useEffect, memo, useCallback } from 'react';
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

  const handleTransitionEnd = useCallback(() => {
    if (!isZoomed) {
      setIsTransitioning(false);
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
        setShowButtons(true);
      }, 300); // Delay to ensure animation completes
    }
  }, [isZoomed]);

  const handlePowerClick = useCallback(() => {
    setIsZoomed(!isZoomed);
    setIsTransitioning(true);
    setShowButtons(false);
  }, [isZoomed]);

  const handleImageClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
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
  }, [onYearSelect]);

  // Render mobile view
  if (isMobile) {
    return (
      <section className="w-screen h-screen flex flex-col justify-center items-center bg-black">
        <div className="relative w-full h-full cursor-pointer" onClick={handleImageClick}>
          {/* Mobile choice image */}
          <img 
            src="/mobile_choice.png" 
            alt="Choose your experience - click on the year to select" 
            className="w-full h-full object-cover"
          />
          
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

  // Render desktop view
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
                backgroundImage: "url(/choice_screen_new.webp)",
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