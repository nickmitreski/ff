import React, { memo, useState, useEffect } from 'react';
import { AppContentProps } from '../../../data/appData.tsx';
import { aiItems } from '../../../data/folderItemsData.ts';
import { useFolderPosition } from '../../../hooks/useWindowPosition';
import GenericFolder from './GenericFolder';
import MobileRestrictionPopup from './MobileRestrictionPopup';

const AIStuffFolder: React.FC<AppContentProps> = ({ onOpenApp }) => {
  const generatePosition = useFolderPosition('ai');
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpenApp = (appId: string, content?: React.ReactNode, title?: string, positionOverride?: { x: number; y: number }, sizeOverride?: { width: number; height: number }) => {
    // Check if this is an AI tool (all items in aiItems)
    const isAITool = aiItems.some(ai => ai.name === title || ai.appId === appId);
    if (isMobile && isAITool) {
      setShowMobilePopup(true);
      return;
    }
    const position = positionOverride || generatePosition();
    onOpenApp(appId, content, title, position, sizeOverride);
  };

  return (
    <>
      <GenericFolder items={aiItems} onOpenApp={handleOpenApp} />
      {showMobilePopup && (
        <MobileRestrictionPopup onClose={() => setShowMobilePopup(false)} />
      )}
    </>
  );
};

export default memo(AIStuffFolder);