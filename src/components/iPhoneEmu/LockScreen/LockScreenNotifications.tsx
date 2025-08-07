import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LockScreenNotificationsProps {
  tutorialMessages: string[];
}

const Notification = ({ message, index }: { message: string, index: number }) => (
  <motion.div
    initial={{ y: 40, opacity: 0, scale: 0.95 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    exit={{ y: 40, opacity: 0, scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 250, damping: 30, delay: index === 0 ? 0.1 : 0.9 }}
    className="w-[95%] max-w-[380px] mx-auto flex items-center rounded-2xl bg-gray-400 bg-opacity-60 backdrop-blur-md shadow-md mt-2 p-3 relative"
    style={{ minHeight: 56 }}
  >
    {/* Green Messages Icon only */}
    <div className="w-10 h-10 flex items-center justify-center mr-3">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="16" fill="#34C759" />
        <path d="M10 16c0-2.76 2.91-5 6.5-5s6.5 2.24 6.5 5-2.91 5-6.5 5c-.53 0-1.05-.05-1.54-.15-.3-.06-.6.01-.83.2l-1.45 1.2c-.44.36-1.09.01-1.04-.54l.17-1.5c.03-.24-.08-.47-.27-.63C10.53 17.97 10 17.03 10 16z" fill="#fff"/>
      </svg>
    </div>
    {/* Text */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900 text-base">Messages</span>
        <span className="text-xs text-gray-700 ml-2">now</span>
      </div>
      <div className="text-gray-900 text-sm font-medium leading-tight">{message}</div>
    </div>
  </motion.div>
);

const LockScreenNotifications: React.FC<LockScreenNotificationsProps> = ({ tutorialMessages }) => (
  <div className="absolute left-0 right-0 flex flex-col items-center z-50" style={{bottom: '180px'}}>
    <AnimatePresence>
      {tutorialMessages.map((msg, i) => (
        <Notification key={i} message={msg} index={i} />
      ))}
    </AnimatePresence>
  </div>
);

export default LockScreenNotifications; 