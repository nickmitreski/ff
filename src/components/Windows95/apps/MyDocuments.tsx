import React, { memo } from 'react';
import { useFolderPosition } from '../../../hooks/useWindowPosition';
import { AppContentProps } from '../../../data/appData.tsx';
import { myDocumentItems } from '../../../data/folderItemsData.ts';
import GenericFolder from './GenericFolder';

const MyDocuments: React.FC<AppContentProps> = ({ onOpenApp }) => {
  const generatePosition = useFolderPosition('documents');

  const handleOpenApp = (appId: string, content?: React.ReactNode, title?: string, positionOverride?: { x: number; y: number }, sizeOverride?: { width: number; height: number }) => {
    const position = positionOverride || generatePosition();
    onOpenApp(appId, content, title, position, sizeOverride);
  };

  return (
    <GenericFolder items={myDocumentItems} onOpenApp={handleOpenApp} />
  );
};

export default memo(MyDocuments);