import React, { useCallback } from 'react';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShutdown?: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onShutdown }) => {
  const { playStartup } = useSoundEffects();

  const handleItemClick = useCallback((action: () => void) => {
    playStartup();
    action();
  }, [playStartup]);

  const handleShutdown = () => {
    if (onShutdown) {
      onShutdown();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="win95-start-menu">
        <div className="win95-start-menu-banner" />
        <div className="win95-start-menu-items">
          <div className="win95-start-menu-item" onClick={() => handleItemClick(() => {})}>
            <img src="/BatExec_32x32_4.png" alt="Programs" />
            <span>Programs</span>
            <span className="win95-start-menu-arrow">▶</span>
          </div>
          
          <div className="win95-start-menu-item" onClick={() => handleItemClick(() => {})}>
            <img src="/Awschd32400_32x32_4.png" alt="Documents" />
            <span>Documents</span>
          </div>
          
          <div className="win95-start-menu-item" onClick={() => handleItemClick(() => {})}>
            <img src="/Awfxcg321304_32x32_4.png" alt="Settings" />
            <span>Settings</span>
            <span className="win95-start-menu-arrow">▶</span>
          </div>
          
          <div className="win95-start-menu-item" onClick={() => handleItemClick(() => {})}>
            <img src="/Network2_32x32_4.png" alt="Find" />
            <span>Find</span>
            <span className="win95-start-menu-arrow">▶</span>
          </div>
          
          <div className="win95-start-menu-item" onClick={() => handleItemClick(() => {})}>
            <img src="/MediaAudio_32x32_4.png" alt="Help" />
            <span>Help</span>
          </div>
          
          <div className="win95-start-menu-item" onClick={() => handleItemClick(() => {})}>
            <img src="/Controls3000_32x32_4.png" alt="Run" />
            <span>Run...</span>
          </div>
          
          <div className="win95-start-menu-separator" />
          
          <div className="win95-start-menu-item" onClick={handleShutdown}>
            <img src="/Mapi32451_32x32_4.png" alt="Shut Down" />
            <span>Shut Down...</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartMenu;