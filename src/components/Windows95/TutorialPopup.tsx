import React, { memo } from 'react';
import '../../styles/windows95.css';

interface TutorialPopupProps {
  message: string;
  onClose: () => void;
  position?: { x: number; y: number };
}

const TutorialPopup: React.FC<TutorialPopupProps> = ({ message, onClose, position }) => {
  // Calculate a centered default position if none provided
  const defaultPosition = position || {
    x: Math.max(10, Math.floor((window.innerWidth - 300) / 2)),
    y: Math.max(10, Math.floor((window.innerHeight - 200) / 2))
  };

  return (
    <div 
      className="win95-window"
      style={{
        position: 'absolute',
        left: defaultPosition.x,
        top: defaultPosition.y,
        width: '300px',
        zIndex: 1000,
      }}
    >
      <div className="win95-window-title">
        <span>Welcome</span>
        <button 
          className="win95-window-close"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className="win95-window-content" style={{ padding: '20px' }}>
        <p style={{ margin: 0 }}>{message}</p>
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button className="win95-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(TutorialPopup);