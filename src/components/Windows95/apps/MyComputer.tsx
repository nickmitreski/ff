import React, { memo } from 'react';
import { AppContentProps } from '../../../data/appData.tsx';
import { myComputerItems } from '../../../data/folderItemsData.ts';
import { useFolderPosition } from '../../../hooks/useWindowPosition';
import GenericFolder from './GenericFolder';

/**
 * MyComputer component displays the contents of the My Computer folder
 * in the Windows 95 interface
 */
const MyComputer: React.FC<AppContentProps> = ({ onOpenApp }) => {
  const generatePosition = useFolderPosition('computer');

  const handleOpenApp = (appId: string, content?: React.ReactNode, title?: string, positionOverride?: { x: number; y: number }, sizeOverride?: { width: number; height: number }) => {
    const position = positionOverride || generatePosition();
    onOpenApp(appId, content, title, position, sizeOverride);
  };

  return (
    <GenericFolder items={myComputerItems} onOpenApp={handleOpenApp} />
  );
};

export default memo(MyComputer);