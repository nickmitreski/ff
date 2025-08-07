import React, { memo } from 'react';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface DesktopContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onArrange: () => void;
  onRefresh: () => void;
  onNewFolder: () => void;
}

const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({
  x,
  y,
  onClose,
  onArrange,
  onRefresh,
  onNewFolder,
}) => {
  const { playMenuSound } = useSoundEffects();

  const handleItemClick = (action: () => void) => {
    playMenuSound();
    action();
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <div 
        className="win95-context-menu"
        style={{
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
          zIndex: 50,
        }}
      >
        <div className="win95-context-menu-item" onClick={() => handleItemClick(onArrange)}>
          <span>Arrange Icons</span>
          <span className="win95-context-menu-arrow">▶</span>
        </div>
        <div className="win95-context-menu-item" onClick={() => handleItemClick(onRefresh)}>
          <span>Refresh</span>
        </div>
        <div className="win95-context-menu-separator" />
        <div className="win95-context-menu-item" onClick={() => handleItemClick(onNewFolder)}>
          <span>New</span>
          <span className="win95-context-menu-arrow">▶</span>
        </div>
        <div className="win95-context-menu-separator" />
        <div className="win95-context-menu-item" onClick={() => handleItemClick(() => {})}>
          <span>Properties</span>
        </div>
      </div>
    </>
  );
};

export default memo(DesktopContextMenu);