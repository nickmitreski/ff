import { useState, useRef, useCallback, useEffect } from 'react';
import { Position, Size, WindowState, WindowType } from '../types/window';

interface UseWindowManagerProps {
  id: string;
  initialPosition: Position;
  initialSize: Size;
  onMinimize: () => void;
  bringToFront: (id: string) => void;
  type: WindowType;
}

/**
 * Custom hook for managing window state, position, and interactions
 * @param id - Window identifier
 * @param initialPosition - Initial window position
 * @param initialSize - Initial window size
 * @param onMinimize - Function to call when window is minimized
 * @param bringToFront - Function to bring window to front
 * @param type - Window type
 * @returns Window management utilities and state
 */
export const useWindowManager = ({
  id,
  initialPosition,
  initialSize,
  onMinimize,
  bringToFront,
  type
}: UseWindowManagerProps) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number>();
  const isMobileRef = useRef(window.innerWidth <= 768);
  
  const [windowState, setWindowState] = useState<WindowState>({
    position: initialPosition,
    size: initialSize,
    isMaximized: false,
    isMinimized: false,
    isDragging: false,
    zIndex: 0,
    type: type
  });

  const [preMaximizeState, setPreMaximizeState] = useState<{position: Position, size: Size} | null>(null);

  // Update isMobileRef when window size changes
  useEffect(() => {
    const handleResize = () => {
      const wasMobile = isMobileRef.current;
      isMobileRef.current = window.innerWidth <= 768;
      
      // If device just became mobile, maximize the window
      if (!wasMobile && isMobileRef.current && !windowState.isMaximized) {
        handleMaximize();
      }
      
      // If window is maximized, update its size to match the new screen size
      if (windowState.isMaximized) {
        setWindowState(prev => ({
          ...prev,
          size: {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight - 28
          }
        }));
      }
      
      // If window is larger than screen, resize it to fit
      if (!windowState.isMaximized) {
        const maxWidth = document.documentElement.clientWidth;
        const maxHeight = document.documentElement.clientHeight - 28;
        
        if (windowState.size.width > maxWidth || windowState.size.height > maxHeight) {
          setWindowState(prev => ({
            ...prev,
            size: {
              width: Math.min(prev.size.width, maxWidth),
              height: Math.min(prev.size.height, maxHeight)
            },
            position: {
              x: Math.min(prev.position.x, Math.max(0, maxWidth - prev.size.width)),
              y: Math.min(prev.position.y, Math.max(0, maxHeight - prev.size.height))
            }
          }));
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowState.isMaximized, windowState.size]);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.target instanceof HTMLButtonElement || windowState.isMaximized) return;
    
    const window = windowRef.current;
    if (!window) return;

    setWindowState(prev => ({ ...prev, isDragging: true }));
    window.classList.add('dragging');
    bringToFront(id);

    // Handle both mouse and touch events
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0];
      dragStartPosRef.current = {
        x: touch.clientX - window.offsetLeft,
        y: touch.clientY - window.offsetTop
      };
    } else {
      // Mouse event
      dragStartPosRef.current = {
        x: e.clientX - window.offsetLeft,
        y: e.clientY - window.offsetTop
      };
    }

    e.preventDefault();
  }, [windowState.isMaximized, bringToFront, id]);

  useEffect(() => {
    if (!windowState.isDragging) return;

    const window = windowRef.current;
    if (!window) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!windowState.isDragging || !dragStartPosRef.current) return;

      animationFrameRef.current = requestAnimationFrame(() => {
        let clientX, clientY;
        
        if ('touches' in e) {
          // Touch event
          const touch = e.touches[0];
          clientX = touch.clientX;
          clientY = touch.clientY;
        } else {
          // Mouse event
          clientX = (e as MouseEvent).clientX;
          clientY = (e as MouseEvent).clientY;
        }
        
        const newX = clientX - dragStartPosRef.current!.x;
        const newY = clientY - dragStartPosRef.current!.y;
        
        const maxX = window.parentElement?.clientWidth ?? window.ownerDocument.documentElement.clientWidth;
        const maxY = (window.parentElement?.clientHeight ?? window.ownerDocument.documentElement.clientHeight) - 28;
        
        const boundedX = Math.max(0, Math.min(newX, maxX - window.offsetWidth));
        const boundedY = Math.max(0, Math.min(newY, maxY - window.offsetHeight));
        
        setWindowState(prev => ({
          ...prev,
          position: { x: boundedX, y: boundedY }
        }));
      });
    };

    const handleMouseUp = () => {
      setWindowState(prev => ({ ...prev, isDragging: false }));
      window.classList.remove('dragging');
      dragStartPosRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    // Add both mouse and touch event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [windowState.isDragging]);

  const handleMaximize = useCallback(() => {
    const window = windowRef.current;
    if (!window) return;

    if (!windowState.isMaximized) {
      setPreMaximizeState({
        position: windowState.position,
        size: windowState.size
      });

      setWindowState(prev => ({
        ...prev,
        position: { x: 0, y: 0 },
        size: {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight - 28
        },
        isMaximized: true
      }));
    } else {
      if (preMaximizeState) {
        setWindowState(prev => ({
          ...prev,
          position: preMaximizeState.position,
          size: preMaximizeState.size,
          isMaximized: false
        }));
      }
    }
  }, [windowState.isMaximized, windowState.position, windowState.size, preMaximizeState]);

  const handleMinimize = useCallback(() => {
    setWindowState(prev => ({ ...prev, isMinimized: true }));
    onMinimize();
  }, [onMinimize]);

  // Auto-maximize on mobile for better UX - immediately on mount
  useEffect(() => {
    if (isMobileRef.current) {
      handleMaximize();
    }
  }, []);

  return {
    windowRef,
    windowState,
    handleMouseDown,
    handleMaximize,
    handleMinimize
  };
};