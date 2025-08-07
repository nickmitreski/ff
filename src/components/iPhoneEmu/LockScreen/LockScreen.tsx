import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LockScreenNotifications from './LockScreenNotifications';
import LockScreenSlider from './LockScreenSlider';
import LockScreenTimeDisplay from './LockScreenTimeDisplay';
import LockScreenBackground from './LockScreenBackground';
import LockScreenGrid from './LockScreenGrid';
import { useLockScreen } from './useLockScreen';
import { LOCK_SCREEN_CONSTANTS, LOCK_SCREEN_TYPOGRAPHY } from './constants';

interface LockScreenProps {
  onUnlock: () => void;
  tutorialMessages: string[];
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, tutorialMessages }) => {
  const { handleUnlock } = useLockScreen({ onUnlock });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-50 overflow-hidden flex flex-col justify-between"
        style={{
          fontFamily: LOCK_SCREEN_TYPOGRAPHY.FONT_FAMILY,
        }}
      >
        {/* Wallpaper background with dark blur overlay */}
        <LockScreenBackground />
        
        {/* Main Content - Now properly positioned within screen area */}
        <div className="flex-1 flex flex-col justify-center items-center pt-10 pb-8">
          {/* Time display */}
          <LockScreenTimeDisplay />
          
          {/* Notifications below time */}
          <div className="mt-6 w-full flex flex-col items-center">
            <LockScreenNotifications tutorialMessages={tutorialMessages} />
          </div>
          
          {/* Spacer to push slider lower */}
          <div className="flex-1" />
          
          {/* Slide to Unlock Slider */}
          <div 
            className="mb-4 flex justify-center"
            style={{
              width: LOCK_SCREEN_CONSTANTS.SLIDER_WIDTH, 
              height: LOCK_SCREEN_CONSTANTS.SLIDER_HEIGHT
            }}
          >
            <LockScreenSlider onUnlock={handleUnlock} />
          </div>
        </div>
        
        {/* Subtle grid pattern overlay for authenticity */}
        <LockScreenGrid />
      </motion.div>
    </AnimatePresence>
  );
};

export default LockScreen; 