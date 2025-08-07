import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone } from 'lucide-react';

interface TutorialNotificationProps {
  message: string;
  step: number;
  totalSteps: number;
  onClose: () => void;
  onNext: () => void;
}

const TutorialNotification: React.FC<TutorialNotificationProps> = ({
  message,
  step,
  totalSteps,
  onClose,
  onNext
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-advance after 5 seconds if not the last step
  useEffect(() => {
    if (step < totalSteps) {
      const timer = setTimeout(() => {
        onNext();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, totalSteps, onNext]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      onNext();
    } else {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute top-2 left-2 right-2 z-50"
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/30 overflow-hidden">
            {/* Compact iPhone-style notification */}
            <div className="flex items-start p-3 space-x-3">
              {/* App Icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900 text-sm">Flash Forward</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">now</span>
                    <button
                      onClick={handleClose}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200/70 hover:bg-gray-300/70 transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-800 text-sm leading-relaxed mb-2">
                  {message}
                </p>
                
                {/* Compact controls */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {Array.from({ length: totalSteps }, (_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          i < step ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleClose}
                      className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100/80 rounded-md hover:bg-gray-200/80 transition-colors"
                    >
                      Skip
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      {step < totalSteps ? 'Next' : 'Got it!'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialNotification; 