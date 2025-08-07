import React, { useCallback, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AppContentProps } from '../../../data/appData.tsx';
import { FolderItem } from '../../../data/folderItemsData.ts';
import StatsPage from './StatsPage';
import { useWindowsContext } from '../../../contexts/WindowsContext.tsx';
import RandomAudioPlayer from './RandomAudioPlayer';
import { useUniqueWindowPosition } from '../../../hooks/useWindowPosition';
import ComingSoonPopup from '../../ComingSoonPopup';

interface GenericFolderProps extends AppContentProps {
  items: FolderItem[];
  onOpenApp: AppContentProps['onOpenApp'];
  onContinueToModernSite?: () => void;
}

const AI_TOOL_APP_IDS = [
  'basicChatbot',
  'imageGenerator',
  'chatbot',
  'voicebot',
  'gpt90s',
];

const GAME_APP_IDS = [
  'game-mario',
  'game-zelda',
  'game-mk-wiki',
];

/**
 * GenericFolder component displays a folder's contents in the Windows 95 interface
 * and handles opening items with proper positioning
 */
const GenericFolder: React.FC<GenericFolderProps> = ({ onOpenApp, items, onContinueToModernSite }) => {
  const { onBack } = useWindowsContext();
  
  // Use unique positioning for items within folders to prevent overlapping
  const generateUniquePosition = useUniqueWindowPosition();

  // Detect mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /**
   * Handles clicking on a folder item
   * @param item - The folder item that was clicked
   */
  const handleItemClick = useCallback((item: FolderItem) => {
    // Testimonials: Play audio directly if openOnSingleClick and audioUrls
    if (item.audioUrls && item.audioUrls.length > 0 && item.openOnSingleClick) {
      if (isAudioPlaying) return; // Prevent replay if already playing
      const randomUrl = item.audioUrls[Math.floor(Math.random() * item.audioUrls.length)];
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current = new Audio();
      }
      audioRef.current.src = randomUrl;
      audioRef.current.play();
      setIsAudioPlaying(true);
      audioRef.current.onended = () => setIsAudioPlaying(false);
      audioRef.current.onpause = () => setIsAudioPlaying(false);
      return;
    }
    // Defensive patch: Never open a folder window for Winamp unless it is a built-in app with appId 'winamp'
    if (item.name === 'Winamp' && (!item.isBuiltIn || item.appId !== 'winamp')) {
      return;
    }
    if (item.isBuiltIn && item.appId) {
      // Generate a unique position for this app
      const position = generateUniquePosition();

      if (item.component) {
        // If a custom component is provided, use it as the content
        // Special handling for ComingSoonPopup to pass featureName
        if (item.component === ComingSoonPopup) {
          onOpenApp(
            item.appId,
            React.createElement(item.component, { featureName: item.name }),
            item.name,
            position,
            item.defaultSize
          );
        } else {
          onOpenApp(
            item.appId,
            React.createElement(item.component),
            item.name,
            position,
            item.defaultSize
          );
        }
      } else if (item.appId === 'statsPage') {
        onOpenApp(
          item.appId,
          undefined,
          undefined,
          position
        );
      } else if (AI_TOOL_APP_IDS.includes(item.appId)) {
        // Position AI tools with unique positioning
        onOpenApp(item.appId, undefined, undefined, position);
      } else if (GAME_APP_IDS.includes(item.appId)) {
        // Games
        onOpenApp(item.appId, undefined, undefined, position);
      } else {
        // Other built-in apps
        onOpenApp(item.appId, undefined, undefined, position);
      }
    } else if (!item.isBuiltIn && item.path) {
      // Generate a unique position for this external content
      const position = generateUniquePosition();
      // Check if the file is an image
      const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item.path);
      if (isImage) {
        // Dynamically size the popup to the image's aspect ratio
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 700;
        onOpenApp(
          item.name,
          <img 
            src={item.path} 
            alt={item.name} 
            style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', margin: 0 }} 
            onLoad={e => {
              const img = e.target as HTMLImageElement;
              let width = img.naturalWidth;
              let height = img.naturalHeight;
              // Scale down if too large
              const widthRatio = MAX_WIDTH / width;
              const heightRatio = MAX_HEIGHT / height;
              const scale = Math.min(1, widthRatio, heightRatio);
              width = Math.round(width * scale);
              height = Math.round(height * scale);
              // Call onOpenApp again with the correct size
              onOpenApp(
                item.name,
                <img src={item.path} alt={item.name} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', margin: 0 }} />, 
                item.name,
                position,
                { width, height }
              );
            }}
          />,
          item.name,
          position,
          item.defaultSize
        );
      } else {
        onOpenApp(
          item.name,
          <div style={{ 
            width: '100%', 
            height: '100%', 
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <iframe 
              src={item.path}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: '#000'
              }}
              title={item.name}
              allow="fullscreen"
            />
          </div>,
          item.name,
          position,
          item.defaultSize
        );
      }
    } else if (item.audioUrls && item.audioUrls.length > 0) {
      // Generate a unique position for audio player
      const position = generateUniquePosition();
      
      const audioAppId = `audio-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      onOpenApp(
        audioAppId,
        <RandomAudioPlayer audioUrls={item.audioUrls} />,
        item.name,
        position
      );
    }
  }, [onOpenApp, onBack, generateUniquePosition, onContinueToModernSite, isAudioPlaying]);

  return (
    <div className="win95-folder-content">
      {items && items.map((item, index) => {
        const isSingleClick = !!item.openOnSingleClick;
        const itemProps = isSingleClick
          ? { onClick: () => handleItemClick(item) }
          : isMobile
            ? { onClick: () => handleItemClick(item) }
            : { onDoubleClick: () => handleItemClick(item) };
        return isSingleClick ? (
          <motion.div
            key={index}
            className="win95-folder-item"
            whileTap={{ scale: 0.92 }}
            style={{ outline: 'none', boxShadow: 'none' }}
            tabIndex={-1}
            {...itemProps}
          >
            <img 
              src={item.icon} 
              alt={item.name} 
              className="win95-folder-item-icon" 
              style={{ outline: 'none', boxShadow: 'none' }}
            />
            <div className="win95-folder-item-text">{item.name}</div>
          </motion.div>
        ) : (
          <div
            key={index}
            className="win95-folder-item"
            style={{ outline: 'none', boxShadow: 'none' }}
            tabIndex={-1}
            {...itemProps}
          >
            <img 
              src={item.icon} 
              alt={item.name} 
              className="win95-folder-item-icon" 
              style={{ outline: 'none', boxShadow: 'none' }}
            />
            <div className="win95-folder-item-text">{item.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default GenericFolder;