import React, { memo, useState, useEffect } from 'react';
import { AppContentProps } from '../../../data/appData.tsx';
import GenericFolder from './GenericFolder';
import { games } from '../../../data/folderItemsData.ts';
import { useFolderPosition } from '../../../hooks/useWindowPosition';
import MobileRestrictionPopup from './MobileRestrictionPopup';

const GamesFolder: React.FC<AppContentProps> = ({ onOpenApp }) => {
  const generatePosition = useFolderPosition('games');
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleOpenApp = (appId: string, content?: React.ReactNode, title?: string, positionOverride?: { x: number; y: number }, sizeOverride?: { width: number; height: number }) => {
    // Check if this is a game item (has a path or is a game app)
    const isGame = games.some(game => 
      game.name === title || 
      game.appId === appId || 
      (game.path && game.path.includes('/games/'))
    );
    
    if (isMobile && isGame) {
      setShowMobilePopup(true);
      return;
    }
    
    const position = positionOverride || generatePosition();
    onOpenApp(appId, content, title, position, sizeOverride);
  };
  
  return (
    <>
      <GenericFolder items={games} onOpenApp={handleOpenApp} />
      {showMobilePopup && (
        <MobileRestrictionPopup onClose={() => setShowMobilePopup(false)} />
      )}
    </>
  );
};

export default memo(GamesFolder);