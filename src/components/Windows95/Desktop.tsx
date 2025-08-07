import React, { useState, useEffect, useCallback, memo } from 'react';
import Icon from './Icon';
import Taskbar from './Taskbar';
import DesktopContextMenu from './DesktopContextMenu';
import TutorialPopup from './TutorialPopup';
import { WindowsContextProvider } from '../../contexts/WindowsContext';
import { AppData, initialAppData, AppContentProps } from '../../data/appData.tsx';
import { Windows95DesktopProps } from '../../types/index';
import useSound from 'use-sound';
import '../../styles/windows95.css';
import { WindowType } from '../../types/window';

import { useWindowManager } from '../../contexts/WindowManagerContext';
import WindowManager from './WindowManager';
import { useUniqueWindowPosition } from '../../hooks/useWindowPosition';

interface ContextMenuPosition {
  x: number;
  y: number;
}

// Helper to get a random position for game popups near the center of the screen
const getRandomGamePopupPosition = (width: number, height: number) => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const centerX = (screenWidth - width) / 2;
  const centerY = (screenHeight - height) / 2;
  const maxOffsetX = Math.max(0, (screenWidth - width) / 4);
  const maxOffsetY = Math.max(0, (screenHeight - height) / 4);
  const offsetX = (Math.random() - 0.5) * 2 * maxOffsetX;
  const offsetY = (Math.random() - 0.5) * 2 * maxOffsetY;
  const x = Math.max(0, Math.min(centerX + offsetX, screenWidth - width));
  const y = Math.max(0, Math.min(centerY + offsetY, screenHeight - height - 28)); // 28 for taskbar
  return { x, y };
};

// Helper to determine if an app is a game or coming soon/external
const isGameApp = (appId: string) => {
  return appId && (
    appId.startsWith('game-') ||
    appId.toLowerCase().includes('comingsoon') ||
    appId.toLowerCase().includes('external-')
  );
};

const Desktop: React.FC<Windows95DesktopProps> = memo(({ onBack, setCurrentView }) => {
  const { createWindow } = useWindowManager();
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const generateUniquePosition = useUniqueWindowPosition();
  const [appData] = useState<AppData>(initialAppData);
  
  const [playStartup] = useSound('/sounds/windows95-startup.mp3', { volume: 0.5 });

  // Play startup sound on mount
  useEffect(() => {
    // Play startup sound when component mounts
    playStartup();
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [playStartup]);

  // Steps for the tutorial popup
  const tutorialSteps = [
    {
      message: "Welcome to 1996! This is a Windows 95 desktop experience.",
      position: { x: 60, y: 60 }
    },
    {
      message: "Feel free to explore the site! Double-click on icons to open them and have some fun.",
      position: { x: 60, y: 220 }
    },
    {
      message: "The Flash Forward folder contains our digital agency services. Take a look inside. Click on 'Update' if you want to update the website to a 2025 one!",
      position: { x: 180, y: 500 }
    }
  ];

  // Advance tutorial step
  const handleTutorialClose = useCallback(() => {
    setCurrentTutorialStep(prev => prev + 1);
  }, [currentTutorialStep]);

  // Clamp window position to viewport to prevent off-screen windows
  const clampPositionToViewport = useCallback((x: number, y: number, width: number, height: number) => {
    const maxX = window.innerWidth - width;
    const maxY = window.innerHeight - 28 - height; // 28px for taskbar
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    };
  }, []);

  // Main handler to open apps/windows from desktop icons
  const handleOpenApp = useCallback((appId: string, content?: React.ReactNode, title?: string, positionOverride?: { x: number; y: number }, sizeOverride?: { width: number; height: number }) => {
    console.log(`[WINAMP DEBUG] handleOpenApp called with:`, { appId, hasContent: !!content, title, positionOverride, sizeOverride });
    
    if (appId && appId.toLowerCase().includes('comingsoon')) {
      sizeOverride = { width: 600, height: 332 };
    }
    if (appId === 'winamp' && !content) {
      console.warn('[DEFENSIVE] Prevented blank Winamp window creation.');
      return;
    }
    if (appId === 'winamp' && (!appData[appId] || appData[appId].contentType !== 'component' || !appData[appId].component)) {
      console.warn('[DEFENSIVE] Winamp app data validation failed.');
      return;
    }

    // Use the correct size for this app
    const appDefaultSize = appData[appId]?.defaultSize || { width: 400, height: 300 };
    const finalSize = sizeOverride || appDefaultSize;

    // If this is a game popup, use a random position near the center
    if (isGameApp(appId)) {
      positionOverride = getRandomGamePopupPosition(finalSize.width, finalSize.height);
    }

    let finalPosition: { x: number; y: number };

    // Always prioritize positionOverride from the component
    if (positionOverride) {
      finalPosition = positionOverride;
    } else if (appData[appId]?.windowPosition) {
      // Fall back to appData windowPosition if no override provided
      finalPosition = { ...appData[appId].windowPosition };
    } else {
      // Use unique positioning for apps opened from desktop icons
      finalPosition = generateUniquePosition();
    }
    
    // Clamp so window is always fully visible
    finalPosition = clampPositionToViewport(finalPosition.x, finalPosition.y, finalSize.width, finalSize.height);

    // Set alwaysOnTop true for all folders (appId ends with 'Folder')
    const isFolder = appId.endsWith('Folder');
    const alwaysOnTop = isFolder ? true : (appData[appId]?.isAlwaysOnTop || false);

    console.log(`[WINAMP DEBUG] About to create window for ${appId}:`, {
      isFolder,
      alwaysOnTop,
      finalPosition,
      finalSize,
      contentType: appData[appId]?.contentType,
      hasComponent: !!appData[appId]?.component
    });

    // Special handling for ModernStatsPopup (statsPage)
    if (appId === 'statsPage') {
      console.log(`[WINAMP DEBUG] Creating statsPage window`);
      createWindow({
        id: appId,
        title: title || appData[appId]?.name || appId,
        content: appData[appId].contentType === 'component'
          ? React.createElement(
              appData[appId].component as React.ComponentType<AppContentProps & { onContinueToModernSite?: () => void }>,
              {
                onOpenApp: handleOpenApp,
                onContinueToModernSite: () => setCurrentView('2025'),
              }
            )
          : undefined,
        position: finalPosition,
        size: finalSize,
        type: appData[appId]?.type as WindowType || (isFolder ? 'folder' : 'application'),
        styles: {
          isResizable: appData[appId]?.isResizable !== undefined ? appData[appId]?.isResizable : true,
          alwaysOnTop,
        },
      });
    } else if (content !== undefined && title !== undefined) {
      console.log(`[WINAMP DEBUG] Creating window with provided content for ${appId}`);
      createWindow({
        id: appId,
        title: title,
        content: content,
        position: finalPosition,
        size: finalSize,
        type: appData[appId]?.type as WindowType || (isFolder ? 'folder' : 'application'),
        styles: {
          isResizable: appData[appId]?.isResizable !== undefined ? appData[appId]?.isResizable : true,
          alwaysOnTop,
        },
      });
    } else if (appData[appId]) {
      // Prevent blank Winamp window
      if (appId === 'winamp') {
        console.log(`[WINAMP DEBUG] Skipping Winamp creation in fallback branch`);
        return;
      }
      console.log(`[WINAMP DEBUG] Creating window from appData for ${appId}`);
      createWindow({
        id: appId,
        title: title || appData[appId]?.name || appId,
        content: appData[appId].contentType === 'component' ? React.createElement(appData[appId].component as React.ComponentType<AppContentProps>, { onOpenApp: handleOpenApp }) : undefined,
        position: finalPosition,
        size: finalSize,
        type: appData[appId]?.type as WindowType || (isFolder ? 'folder' : 'application'),
        styles: {
          isResizable: appData[appId]?.isResizable !== undefined ? appData[appId]?.isResizable : true,
          alwaysOnTop,
        },
      });
    } else {
      console.error(`Data for app ${appId} not found.`);
    }
  }, [appData, createWindow, generateUniquePosition, clampPositionToViewport, setCurrentView]);

  // Show context menu on right-click
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Only show context menu if clicking directly on the desktop
    if (e.target === e.currentTarget) {
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  }, []);

  // Placeholder for arranging icons
  const handleArrangeIcons = useCallback(() => {
    setContextMenu(null);
    // Implementation for arranging icons
  }, []);

  // Placeholder for refresh
  const handleRefresh = useCallback(() => {
    setContextMenu(null);
    // Implementation for refresh
  }, []);

  // Placeholder for new folder
  const handleNewFolder = useCallback(() => {
    setContextMenu(null);
    // Implementation for new folder
  }, []);

  // Adjust icon position if needed (currently returns original)
  const getAdjustedIconPosition = useCallback((originalPosition: { x: number; y: number }) => {
    // Implementation for adjusting icon position
    return originalPosition;
  }, []);

  // Define desktop icons and their positions
  const desktopIcons = [
    // First column
    { id: 'myComputer', position: { x: 20, y: 20 } },
    { id: 'myDocuments', position: { x: 20, y: 120 } },
    { id: 'recycleBin', position: { x: 20, y: 220 } },
    { id: 'calculator', position: { x: 20, y: 320 } },
    { id: 'internetExplorer', position: { x: 20, y: 420 } },
    { id: 'msPaint', position: { x: 20, y: 520 } },
    { id: 'winamp', position: { x: 20, y: 620 } },
    
    // Second column
    { id: 'mediaFolder', position: { x: 130, y: 20 } },
    { id: 'gamesFolder', position: { x: 130, y: 120 } },
    { id: 'aiStuffFolder', position: { x: 130, y: 220 } },
    { id: 'tv', position: { x: 130, y: 320 } },
    { id: 'notepad', position: { x: 130, y: 420 } },
    { id: 'flashForwardFolder', position: { x: 130, y: 520 } }
  ];

  return (
    <WindowsContextProvider onBack={onBack}>
      <h1 className="sr-only">Flash Forward Digital - Windows 95 Retro Experience - Explore our digital agency services through a nostalgic 1996 interface</h1>
      <div 
        className="win95"
        onContextMenu={handleContextMenu}
        onClick={() => setContextMenu(null)}
      >
        {/* Show tutorial popup if not completed */}
        {currentTutorialStep < tutorialSteps.length && (
          <TutorialPopup
            message={tutorialSteps[currentTutorialStep].message}
            onClose={handleTutorialClose}
            position={isMobile ? 
              { x: window.innerWidth / 2 - 150, y: window.innerHeight / 3 } : 
              tutorialSteps[currentTutorialStep].position}
          />
        )}
        {/* Render desktop icons */}
        {desktopIcons.map(({ id, position }) => {
          const app = appData[id];
          if (!app) {
            console.error(`App ${id} not found in appData`);
            return null;
          }
          
          return (
            <Icon 
              key={id}
              name={app.name}
              icon={app.icon}
              x={isMobile ? 
                getAdjustedIconPosition(position).x : 
                position.x}
              y={isMobile ? 
                getAdjustedIconPosition(position).y : 
                position.y}
              onOpen={() => {
                if (id === 'winamp') {
                  // Winamp doesn't need onOpenApp prop, it's a standalone player
                  handleOpenApp(id, React.createElement(app.component as React.ComponentType<{}>), app.name);
                } else {
                  handleOpenApp(id, app.contentType === 'component' ? React.createElement(app.component as React.ComponentType<AppContentProps>, { onOpenApp: handleOpenApp }) : undefined, app.name);
                }
              }}
              singleClick={isMobile}
            />
          );
        })}
        {/* Render all windows using WindowManager */}
        <WindowManager />
        <Taskbar onBack={onBack} />
        {/* Show context menu if open */}
        {contextMenu && (
          <DesktopContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onArrange={handleArrangeIcons}
            onRefresh={handleRefresh}
            onNewFolder={handleNewFolder}
          />
        )}
      </div>
    </WindowsContextProvider>
  );
});

export default Desktop;