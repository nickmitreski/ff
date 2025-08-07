import React, { useEffect, useState } from 'react';
import { colors } from '../../theme/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { getSessionDuration, getClickCount } from '../../lib/analytics-new';

interface ModernStatsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueToModernSite: () => void;
}

function formatDuration(seconds: number) {
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const ModernStatsPopup: React.FC<ModernStatsPopupProps> = ({ isOpen, onClose, onContinueToModernSite }) => {
  const [sessionDuration, setSessionDuration] = useState(getSessionDuration ? getSessionDuration() : 0);
  const [clickCount, setClickCount] = useState(getClickCount ? getClickCount() : 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(getSessionDuration ? getSessionDuration() : prev => prev + 1);
      setClickCount(getClickCount ? getClickCount() : prev => prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex items-center justify-center p-2 md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-[#181820]/80 rounded-xl border border-gray-800 w-full max-w-3xl max-h-[95vh] overflow-hidden shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            style={{ fontSize: '0.95rem' }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h2 className="text-2xl font-light tracking-tight text-white">
                Your Engagement Stats
              </h2>
              <div className="flex gap-8 items-center">
                <div className="flex flex-col items-end">
                  <span className="text-yellow-400 font-extrabold text-5xl leading-none">{formatDuration(sessionDuration)}</span>
                  <span className="text-sm text-white leading-none">Session Time</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-yellow-400 font-extrabold text-5xl leading-none">{clickCount}</span>
                  <span className="text-sm text-white leading-none">Clicks</span>
                </div>
              </div>
            </div>

            {/* Stats Sections */}
            <div className="p-3 flex flex-col gap-2">
              {/* Section 1: Time Impact on Engagement */}
              <div className="bg-[#1a1a22]/80 rounded-lg border border-gray-800 p-3 mb-1">
                <div className="text-base font-bold mb-2 text-blue-400">Time Impact on Engagement</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-white mb-0.5">2.4x</div>
                    <div className="text-sm text-gray-300 mb-0.5">Higher conversion rate after 2+ minute sessions</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">HubSpot, 2023</div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-white mb-0.5">73%</div>
                    <div className="text-sm text-gray-300 mb-0.5">Better brand recall with longer sessions</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Nielsen Research</div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-white mb-0.5">87%</div>
                    <div className="text-sm text-gray-300 mb-0.5">Return rate for 3min+ sessions</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Google Analytics</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Value of User Interactions */}
              <div className="bg-[#1a1a22]/80 rounded-lg border border-gray-800 p-3 mb-1">
                <div className="text-base font-bold mb-2 text-purple-400">Value of User Interactions</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-white mb-0.5">5.2x</div>
                    <div className="text-sm text-gray-300 mb-0.5">Conversion rate after 4+ clicks</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Forrester Research</div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-white mb-0.5">91%</div>
                    <div className="text-sm text-gray-300 mb-0.5">Users engage more with 3+ clicks</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">UX Design Institute</div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-white mb-0.5">3.8x</div>
                    <div className="text-sm text-gray-300 mb-0.5">Share rate with high interaction</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">ShareThis Analytics</div>
                  </div>
                </div>
              </div>

              {/* Section 3: SEO & Ranking Impact */}
              <div className="bg-[#1a1a22]/80 rounded-lg border border-gray-800 p-3">
                <div className="text-base font-bold mb-2 text-green-400">SEO & Ranking Impact</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-white mb-0.5">45%</div>
                    <div className="text-sm text-gray-300 mb-0.5">SEO boost from 2min+ sessions</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">SEMrush Study</div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-white mb-0.5">67%</div>
                    <div className="text-sm text-gray-300 mb-0.5">Lower bounce rate with 3+ clicks</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Moz Analytics</div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-white mb-0.5">2.1x</div>
                    <div className="text-sm text-gray-300 mb-0.5">Traffic growth from engagement</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Ahrefs Research</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-gray-800 flex justify-center">
              <button
                onClick={onContinueToModernSite}
                className="px-6 py-2 text-black rounded-md transition-colors duration-300 text-sm font-light tracking-tight"
                style={{ backgroundColor: colors.primary.yellow }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = `${colors.primary.yellow}dd`)}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = colors.primary.yellow)}
              >
                Continue to modern site
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModernStatsPopup; 