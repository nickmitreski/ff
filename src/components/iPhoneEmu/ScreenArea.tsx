import React from 'react';
import StatusBar from './StatusBar';
import AppGrid from './AppGrid';
import Dock from './Dock';
import LockScreen from './LockScreen/LockScreen';
import AppPopup from './AppPopup';

interface ScreenAreaProps {
  appData: any[];
  selectedApp: string | null;
  onAppPress: (appId: string) => void;
  onHomePress: () => void;
  isLocked: boolean;
  onUnlock: () => void;
  tutorialMessages: string[];
  renderApp: (appId: string) => React.ReactNode;
}

const ScreenArea: React.FC<ScreenAreaProps> = ({
  appData,
  selectedApp,
  onAppPress,
  onHomePress,
  isLocked,
  onUnlock,
  tutorialMessages,
  renderApp,
}) => (
  <div className="flex-1 relative flex flex-col bg-gray-900 max-h-[600px]" style={{ borderRadius: 0 }}>
    <StatusBar />
    <AppGrid appData={appData} onAppPress={onAppPress} selectedApp={selectedApp} onHomePress={onHomePress} />
    <Dock onAppPress={onAppPress} />
    {selectedApp && <AppPopup appId={selectedApp} onClose={onHomePress} renderApp={renderApp} />}
    {isLocked && (
      <div className="absolute inset-0 z-50" style={{ borderRadius: 0 }}>
        <LockScreen onUnlock={onUnlock} tutorialMessages={tutorialMessages} />
      </div>
    )}
  </div>
);

export default ScreenArea; 