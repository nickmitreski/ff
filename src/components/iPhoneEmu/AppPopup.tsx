import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppPopupProps {
  appId: string;
  onClose: () => void;
  renderApp: (appId: string) => React.ReactNode;
}

const AppPopup: React.FC<AppPopupProps> = ({ appId, onClose, renderApp }) => (
  <AnimatePresence>
    <motion.div
      key={appId}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 z-40"
    >
      {/* Dimming overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10" onClick={onClose} />
      {/* App content */}
      <div className="absolute inset-0 z-20">
        {renderApp(appId)}
      </div>
    </motion.div>
  </AnimatePresence>
);

export default AppPopup; 