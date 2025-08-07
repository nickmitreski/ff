import React from 'react';
import { AppContentProps } from '../../../data/appData.tsx';
import { flashForwardFolders } from '../../../data/folderItemsData.ts';
import { useFolderPosition } from '../../../hooks/useWindowPosition';
import GenericFolder from './GenericFolder';

/**
 * FlashForwardFolder component displays the contents of the Flash Forward folder
 * in the Windows 95 interface
 */
const FlashForwardFolder: React.FC<AppContentProps> = ({ onOpenApp }) => {
  const generatePosition = useFolderPosition('flashforward');

  const handleOpenApp = (appId: string, content?: React.ReactNode, title?: string, positionOverride?: { x: number; y: number }, sizeOverride?: { width: number; height: number }) => {
    const position = positionOverride || generatePosition();
    onOpenApp(appId, content, title, position, sizeOverride);
  };

  return (
    <GenericFolder items={flashForwardFolders} onOpenApp={handleOpenApp} />
  );
};

export default FlashForwardFolder;