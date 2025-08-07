import React, { memo } from 'react';
import { useWindowManager } from '../../contexts/WindowManagerContext';
import StartMenu from './StartMenu';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface TaskbarProps {
  onBack?: () => void;
}

const Taskbar: React.FC<TaskbarProps> = memo(({ onBack }) => {
  const { windows, minimizeWindow, restoreWindow } = useWindowManager();
  const [isStartMenuOpen, setIsStartMenuOpen] = React.useState(false);
  const { playStartup } = useSoundEffects();

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isStartMenuOpen) {
      playStartup();
    }
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  return (
    <>
      <StartMenu 
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onShutdown={onBack}
      />
      <div className="win95-taskbar">
        <button 
          className={`win95-start-button ${isStartMenuOpen ? 'active' : ''}`}
          onClick={handleStartClick}
        >
          <img 
            src="/windows-0.png" 
            alt="Start" 
          />
          Start
        </button>
        
        <div className="win95-taskbar-items">
          {windows?.map((window) => (
            <div 
              key={window.id} 
              className={`win95-taskbar-item ${window.state === 'minimized' ? 'active' : ''}`}
              onClick={() => window.state === 'minimized' ? restoreWindow(window.id) : minimizeWindow(window.id)}
            >
              {window.title}
            </div>
          ))}
        </div>
        
        <div className="win95-taskbar-clock">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </>
  );
});

export default Taskbar;