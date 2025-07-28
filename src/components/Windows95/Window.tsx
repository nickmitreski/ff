import React, { useRef, useEffect, useState } from 'react';
import { useWindowManager } from '../../contexts/WindowManagerContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface WindowProps {
  id: string;
  title: string;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  content: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized?: boolean;
  className?: string;
  isResizable?: boolean;
}

const Window: React.FC<WindowProps> = ({ 
  id, 
  title, 
  initialPosition, 
  initialSize, 
  content,
  onClose,
  onMinimize,
  isMinimized,
  className,
  isResizable = true
}) => {
  const { moveWindow, resizeWindow, focusWindow, bringToFront, windows } = useWindowManager();
  const { playMaximize, playMinimize } = useSoundEffects();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeState, setPreMaximizeState] = useState<{
    position: { x: number; y: number };
    size: { width: number; height: number };
  } | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: Math.max(0, e.clientX - dragStartX),
          y: Math.max(0, e.clientY - dragStartY)
        };
        setPosition(newPosition);
        moveWindow(id, newPosition);
      }

      if (isResizing) {
        const newWidth = Math.max(200, e.clientX - position.x);
        const newHeight = Math.max(100, e.clientY - position.y);
        const newSize = { width: newWidth, height: newHeight };
        setSize(newSize);
        resizeWindow(id, newSize);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, id, position.x, position.y, moveWindow, resizeWindow, dragStartX, dragStartY]);

  useEffect(() => {
    // Focus window when mounted
    focusWindow(id);
  }, [id, focusWindow]);

  // Debug logging for Winamp content
  console.log(`[WINAMP DEBUG] Window component rendering:`, { id, title, hasContent: !!content, windowClass: `win95-window${id === 'winamp' ? ' winamp-window' : ''}${className ? ' ' + className : ''}` });
  if (title === 'Winamp' && content) {
    console.log(`[WINAMP DEBUG] Winamp window has content, proceeding normally`);
    // Content is available, proceed normally
  }
  // Add unique class for Winamp window
  const windowClass = `win95-window${id === 'winamp' ? ' winamp-window' : ''}${className ? ' ' + className : ''}`;
  // Prevent rendering a blank Winamp window
  if (id === 'winamp' && !content) {
    console.log(`[WINAMP DEBUG] Preventing blank Winamp window render`);
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left click
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragStartX(e.clientX - rect.left);
    setDragStartY(e.clientY - rect.top);
    bringToFront(id);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !isResizable) return;
    e.stopPropagation();
    setIsResizing(true);
    bringToFront(id);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMinimize) {
      playMinimize();
      onMinimize();
    }
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMaximized) {
      if (preMaximizeState) {
        setPosition(preMaximizeState.position);
        setSize(preMaximizeState.size);
        moveWindow(id, preMaximizeState.position);
        resizeWindow(id, preMaximizeState.size);
      }
    } else {
      setPreMaximizeState({ position, size });
      const maxSize = {
        width: window.innerWidth,
        height: window.innerHeight - 28 // Account for taskbar
      };
      setPosition({ x: 0, y: 0 });
      setSize(maxSize);
      moveWindow(id, { x: 0, y: 0 });
      resizeWindow(id, maxSize);
    }
    playMaximize();
    setIsMaximized(!isMaximized);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  if (isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className={windowClass}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: windows.find(w => w.id === id)?.zIndex || 1000
      }}
      onMouseDown={() => bringToFront(id)}
    >
      <div 
        className="win95-window-title"
        onMouseDown={handleMouseDown}
        onDoubleClick={isResizable ? handleMaximize : undefined}
      >
        <span className="win95-window-title-text">{title}</span>
        <div className="win95-window-controls">
          <button 
            className="win95-window-control minimize"
            onClick={handleMinimize}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label="Minimize"
            type="button"
          />
          {isResizable && (
            <button 
              className="win95-window-control maximize"
              onClick={handleMaximize}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="Maximize"
              type="button"
            />
          )}
          <button 
            className="win95-window-control close"
            onClick={handleClose}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label="Close"
            type="button"
          />
        </div>
      </div>
      <div 
        className="win95-window-content"
        onMouseDown={() => bringToFront(id)}
      >
        {content}
      </div>
      {isResizable && !isMaximized && (
        <div 
          className="win95-window-resize-handle"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};

export default Window;