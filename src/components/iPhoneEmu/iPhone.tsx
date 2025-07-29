import React, { useState, useCallback, memo } from 'react';
import DeviceFrame from './DeviceFrame';
import ScreenArea from './ScreenArea';
import MessagesApp from './MessagesApp';
import CalculatorApp from './CalculatorApp';
import ClockApp from './ClockApp';
import CalendarApp from './CalendarApp';
import PhotosApp from './PhotosApp';
import ContactsApp from './ContactsApp';
import NotesApp from './NotesApp';
import SettingsApp from './SettingsApp';
import YouTubeApp from './YouTubeApp';
import MapsApp from './MapsApp';
import WeatherApp from './WeatherApp';
import StocksApp from './StocksApp';
import AppStoreApp from './AppStoreApp';
import TestimonialsApp from './TestimonialsApp';
import ITunesApp from './iTunesApp';
import VideosApp from './VideosApp';
import PhoneApp from './PhoneApp';
import ContactUsApp from './ContactUsApp';
import ModernSiteApp from './ModernSiteApp';
import GameApp from './GameApp';
import { ViewType } from '../../types/index';

// Tutorial messages shown on lock screen
const TUTORIAL_MESSAGES = [
  "Welcome to the 2007 Flash Forward experience. Explore the apps and games, have some fun.",
  "When you're ready, click on the 'Modern Site' button to get to the 2025 website."
];

// Example app data array for iPhone home screen
const gameApps = [
  { id: 'doodle-jump', icon: 'ArrowUp', label: 'Doodle Jump', color: 'bg-yellow-500', imageIcon: '/iphone/Games_Icons_Iphone/Doodle_Jump.png' },
  { id: 'paper-toss', icon: 'Trash2', label: 'Paper Toss', color: 'bg-blue-400', imageIcon: '/iphone/Games_Icons_Iphone/Paper_Toss.png' },
  { id: 'flappy-bird', icon: 'Bird', label: 'Flappy Bird', color: 'bg-green-600', imageIcon: '/iphone/Games_Icons_Iphone/Flappy_Birds.png' },
  { id: 'taptap-revolution', icon: 'Music', label: 'Tap Tap Revolution', color: 'bg-blue-600', imageIcon: '/iphone/Games_Icons_Iphone/Tap.png' },
  { id: 'tetris', icon: 'Square', label: 'Tetris', color: 'bg-purple-600', imageIcon: '/iphone/Games_Icons_Iphone/Tetris.png' },
  { id: 'angry-birds', icon: 'Target', label: 'Angry Birds', color: 'bg-red-600', imageIcon: '/iphone/Games_Icons_Iphone/Angry_Birds.png' },
  { id: 'space-invaders', icon: 'Triangle', label: 'Space Invaders', color: 'bg-blue-700' },
  { id: 'breakout', icon: 'Minus', label: 'Breakout', color: 'bg-red-600' },
  { id: 'asteroids', icon: 'Hexagon', label: 'Asteroids', color: 'bg-gray-600' },
];

const appData = [
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
  { id: 'games', type: 'folder', label: 'Games', apps: gameApps },
  { id: 'itunes', icon: 'Music2', label: 'iTunes', color: 'bg-purple-500', imageIcon: '/Music.png' },
];

interface IPhoneProps {
  setCurrentView: (view: ViewType) => void;
}

const IPhone: React.FC<IPhoneProps> = memo(({ setCurrentView }) => {
  // Track which app is selected and if the phone is locked
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(true);

  // Handle app icon press to open app
  const handleAppPress = useCallback((appId: string) => {
    setSelectedApp(appId);
  }, []);

  // Handle home button press to return to home screen
  const handleHomePress = useCallback(() => {
    setSelectedApp(null);
  }, []);

  // Unlock the phone
  const handleUnlock = useCallback(() => {
    setIsLocked(false);
  }, []);

  // Render the selected app based on appId
  const renderApp = useCallback((appId: string) => {
    switch (appId) {
      case 'messages':
        return <MessagesApp onClose={handleHomePress} />;
      case 'calculator':
        return <CalculatorApp />;
      case 'clock':
        return <ClockApp onClose={handleHomePress} />;
      case 'calendar':
        return <CalendarApp onClose={handleHomePress} />;
      case 'photos':
        return <PhotosApp onClose={handleHomePress} />;
      case 'contacts':
        return <ContactsApp onClose={handleHomePress} />;
      case 'notes':
        return <NotesApp onClose={handleHomePress} />;
      case 'settings':
        return <SettingsApp onClose={handleHomePress} />;
      case 'youtube':
        return <YouTubeApp onClose={handleHomePress} />;
      case 'maps':
        return <MapsApp onClose={handleHomePress} />;
      case 'weather':
        return <WeatherApp onClose={handleHomePress} />;
      case 'stocks':
        return <StocksApp onClose={handleHomePress} />;
      case 'appstore':
        return <AppStoreApp onClose={handleHomePress} />;
      case 'voice':
        return <TestimonialsApp onClose={handleHomePress} />;
      case 'itunes':
        return <ITunesApp />;
      case 'videos':
        return <VideosApp />;
      case 'phone':
        return <PhoneApp onClose={handleHomePress} />;
      case 'mail':
        return <ContactUsApp onClose={handleHomePress} />;
      case 'safari':
        return <ModernSiteApp onClose={handleHomePress} setCurrentView={setCurrentView} />;
      case 'doodle-jump':
      case 'paper-toss':
      case 'flappy-bird':
      case 'taptap-revolution':
      case 'tetris':
      case 'angry-birds':
      case 'space-invaders':
      case 'breakout':
      case 'asteroids':
        return <GameApp gameId={appId} onClose={handleHomePress} />;
      default:
        return null;
    }
  }, [handleHomePress, setCurrentView]);

  return (
    <>
      <h1 className="sr-only">Flash Forward Digital - iPhone 2007 Retro Experience - Explore our digital agency services through a nostalgic mobile interface</h1>
      <DeviceFrame onHomePress={handleHomePress}>
        <ScreenArea
          appData={appData}
          selectedApp={selectedApp}
          onAppPress={handleAppPress}
          onHomePress={handleHomePress}
          isLocked={isLocked}
          onUnlock={handleUnlock}
          tutorialMessages={TUTORIAL_MESSAGES}
          renderApp={renderApp}
        />
      </DeviceFrame>
    </>
  );
});

export default IPhone;