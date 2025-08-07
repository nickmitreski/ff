import React, { memo } from 'react';
import { AppContentProps } from '../../../data/appData.tsx';
import { useFolderPosition } from '../../../hooks/useWindowPosition';
import GenericFolder from './GenericFolder';

// Define RecycleBin items to match the existing hardcoded content
const recycleBinItems = [
  {
    name: 'Search History',
    icon: '/Explorer.png',
    isBuiltIn: false
  },
  {
    name: 'Tommy Pamela Tape.mov',
    icon: '/error.png',
    isBuiltIn: false
  },
  {
    name: 'Napster.exe',
    icon: '/napster.png',
    isBuiltIn: false
  },
  {
    name: 'Homework.doc',
    icon: '/homework.png',
    isBuiltIn: false
  }
];

/**
 * RecycleBin component displays the contents of the Recycle Bin folder
 * in the Windows 95 interface
 */
const RecycleBin: React.FC<AppContentProps> = ({ onOpenApp }) => {
  const generatePosition = useFolderPosition('recyclebin');

  const handleOpenApp = (appId: string, content?: React.ReactNode, title?: string, positionOverride?: { x: number; y: number }, sizeOverride?: { width: number; height: number }) => {
    const position = positionOverride || generatePosition();
    onOpenApp(appId, content, title, position, sizeOverride);
  };

  return (
    <GenericFolder items={recycleBinItems} onOpenApp={handleOpenApp} />
  );
};

export default memo(RecycleBin);