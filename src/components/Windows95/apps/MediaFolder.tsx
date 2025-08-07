import React, { memo } from 'react';
import GenericFolder from './GenericFolder';
import { mediaItems } from '../../../data/folderItemsData.ts';
import { AppContentProps } from '../../../data/appData.tsx';
import { useFolderPosition } from '../../../hooks/useWindowPosition';

const MediaFolder: React.FC<AppContentProps> = ({ onOpenApp }) => {
  // Use folder-specific positioning for Media folder
  const generatePosition = useFolderPosition('media');
  
  // Pass the position generator to GenericFolder via a custom onOpenApp
  const handleOpenApp = (appId: string, content?: React.ReactNode, title?: string, positionOverride?: { x: number; y: number }, sizeOverride?: { width: number; height: number }) => {
    const position = positionOverride || generatePosition();
    onOpenApp(appId, content, title, position, sizeOverride);
  };
  
  return (
    <GenericFolder items={mediaItems} onOpenApp={handleOpenApp} />
  );
};

export default memo(MediaFolder);