import React, { memo } from 'react';
import Window from './Window';
import { useWindowManager } from '../../contexts/WindowManagerContext';

const WindowManager: React.FC = memo(() => {
  const { windows, closeWindow, minimizeWindow } = useWindowManager();

  return (
    <div className="window-manager">
      {windows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          initialPosition={window.position}
          initialSize={window.size}
          content={window.content}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          isMinimized={window.state === 'minimized'}
          isResizable={window.styles?.isResizable}
        />
      ))}
    </div>
  );
});

export default WindowManager; 