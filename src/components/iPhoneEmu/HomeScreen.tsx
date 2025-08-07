import React from 'react';
import { motion } from 'framer-motion';
import AppIcon from './AppIcon';
import Folder from './Folder';
import LockScreenGrid from './LockScreen/LockScreenGrid';

interface HomeScreenProps {
  onAppPress: (appId: string) => void;
  selectedApp: string | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onAppPress, 
  selectedApp
}) => {
  const allApps = [
    { id: 'messages', icon: 'Text', label: 'Messages', imageIcon: '/icons/iPhone_OS_Icons/Text.png', color: '' },
    { id: 'calendar', icon: 'Calendar', label: 'Calendar', imageIcon: '/icons/iPhone_OS_Icons/Calendar.png', color: '' },
    { id: 'photos', icon: 'Photos', label: 'Photos', imageIcon: '/icons/iPhone_OS_Icons/Photos.png', color: '' },
    { id: 'clock', icon: 'Clock', label: 'Clock', imageIcon: '/icons/iPhone_OS_Icons/Clock.png', color: '' },
    { id: 'calculator', icon: 'Calculator', label: 'Calculator', imageIcon: '/icons/iPhone_OS_Icons/Calculator.png', color: '' },
    { id: 'notes', icon: 'Notes', label: 'Notes', imageIcon: '/icons/iPhone_OS_Icons/Notes.png', color: '' },
    { id: 'settings', icon: 'Settings', label: 'Settings', imageIcon: '/icons/iPhone_OS_Icons/Settings.png', color: '' },
    { id: 'contacts', icon: 'iPod', label: 'Contacts', imageIcon: '/icons/iPhone_OS_Icons/iPod.png', color: '' },
    { id: 'youtube', icon: 'YouTube', label: 'YouTube', imageIcon: '/icons/iPhone_OS_Icons/YouTube.png', color: '' },
    { id: 'maps', icon: 'Maps', label: 'Maps', imageIcon: '/icons/iPhone_OS_Icons/Maps.png', color: '' },
    { id: 'weather', icon: 'Weather', label: 'Weather', imageIcon: '/icons/iPhone_OS_Icons/Weather.png', color: '' },
    { id: 'stocks', icon: 'Stocks', label: 'Stocks', imageIcon: '/icons/iPhone_OS_Icons/Stocks.png', color: '' },
    { id: 'appstore', icon: 'Safari', label: 'App Store', imageIcon: '/icons/iPhone_OS_Icons/Safari.png', color: '' },
    { id: 'voice', icon: 'iPod', label: 'Testimonials', imageIcon: '/icons/iPhone_OS_Icons/iPod.png', color: '' },
  ];

  const gameApps = [
    { id: 'doodle-jump', icon: 'ArrowUp', label: 'Doodle Jump', color: 'bg-yellow-500' },
    { id: '2048', icon: 'Grid3x3', label: '2048', color: 'bg-orange-500' },
    { id: 'flappy-bird', icon: 'Bird', label: 'Flappy Bird', color: 'bg-green-600', imageIcon: '/iphone/Games_Icons_Iphone/Flappy_Birds.png' },
    { id: 'snake', icon: 'Zap', label: 'Snake', color: 'bg-green-700' },
    { id: 'tetris', icon: 'Square', label: 'Tetris', color: 'bg-purple-600', imageIcon: '/iphone/Games_Icons_Iphone/Tetris.png' },
    { id: 'angry-birds', icon: 'Target', label: 'Angry Birds', color: 'bg-red-600', imageIcon: '/iphone/Games_Icons_Iphone/Angry_Birds.png' },
    { id: 'space-invaders', icon: 'Triangle', label: 'Space Invaders', color: 'bg-blue-700' },
    { id: 'breakout', icon: 'Minus', label: 'Breakout', color: 'bg-red-600' },
    { id: 'asteroids', icon: 'Hexagon', label: 'Asteroids', color: 'bg-gray-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative h-full p-4 pt-6 bg-black overflow-hidden"
      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
    >
      {/* Black gradient background */}
      <div 
        className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #20273c 60%, #0f1120 100%)' }}
      />
      {/* Subtle grid pattern overlay for authenticity (matches lock screen) */}
      <LockScreenGrid />
      
      <div className="relative z-10 h-full flex flex-col justify-end pb-8">
        {/* App Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {allApps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <AppIcon
                {...app}
                onPress={() => onAppPress(app.id)}
                isSelected={selectedApp === app.id}
              />
            </motion.div>
          ))}
          
          {/* Games Folder */}
          <motion.div
            key="games-folder"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: allApps.length * 0.03 }}
          >
            <Folder
              id="games"
              label="Games"
              apps={gameApps}
              onAppPress={onAppPress}
              isSelected={selectedApp === 'games'}
            />
          </motion.div>
          
          {/* iTunes App */}
          <motion.div
            key="itunes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (allApps.length + 1) * 0.03 }}
          >
            <AppIcon
              id="itunes"
              icon="Music2"
              label="iTunes"
              color="bg-purple-500"
              imageIcon="/Music.png"
              onPress={() => onAppPress('itunes')}
              isSelected={selectedApp === 'itunes'}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeScreen;