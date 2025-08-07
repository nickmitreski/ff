import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ModernSiteHeader from './ModernSiteHeader';
import { getSessionDuration, getClickCount } from '../../../lib/analytics-new';
import { ViewType } from '../../../types/index';

interface ModernSiteAppProps {
  onClose: () => void;
  setCurrentView: (view: ViewType) => void;
}

const ModernSiteApp: React.FC<ModernSiteAppProps> = ({ onClose, setCurrentView }) => {
  const [sessionDuration, setSessionDuration] = useState(getSessionDuration());
  const [clickCount, setClickCount] = useState(getClickCount());

  // Update session duration and click count every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(getSessionDuration());
      setClickCount(getClickCount());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper to format seconds as hh:mm:ss
  function formatDuration(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // Add a small offset for demo effect
  const displaySessionDuration = sessionDuration + 7; // e.g. +7 seconds
  const displayClickCount = clickCount + 3;

  const handleContinueToModernSite = () => {
    setCurrentView('2025');
  };

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      <ModernSiteHeader onClose={onClose} />
      
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-6">
          {/* Flash Forward Value Proposition */}
          <div className="mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>Engagement Drives Results</div>
                <div className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>
                  Better engagement leads to measurable business impact.
                </div>
              </div>
            </div>
          </div>

          {/* Current Site Performance Display */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-gray-200">
              <div className="text-center mb-3">
                <div className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>This Site's Live Performance</div>
                <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>See how our design keeps you engaged</div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>
                      {formatDuration(displaySessionDuration)}
                    </div>
                    <div className="text-xs font-medium text-gray-600" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>Your Session Time</div>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>
                      {displayClickCount}
                    </div>
                    <div className="text-xs font-medium text-gray-600" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>Your Interactions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Impact Stats */}
          <div className="space-y-6 mb-6">
            {/* Time Impact Section */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              {/* Accent Bar */}
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
              <div className="px-6 pt-5 pb-4">
                <h3 className="font-bold text-xl text-gray-900 mb-5" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>Longer Sessions Impact</h3>
              </div>
              <div className="px-6 pb-6">
                <div className="space-y-8">
                  <div className="group">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 mr-6">
                        <div className="text-5xl font-black text-blue-600 leading-none tracking-tight" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>2.4x</div>
                        <div className="text-sm font-bold text-gray-800 mt-2 tracking-wide" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>Higher Conversion</div>
                      </div>
                      <div className="flex-1 h-px bg-gray-200 opacity-60"></div>
                    </div>
                    <div className="pl-0">
                      <div className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>
                        Visitors who stay 2+ minutes convert 2.4x more than quick visitors
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 mr-6">
                        <div className="text-5xl font-black text-blue-600 leading-none tracking-tight" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>73%</div>
                        <div className="text-sm font-bold text-gray-800 mt-2 tracking-wide" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>Better Brand Recall</div>
                      </div>
                      <div className="flex-1 h-px bg-gray-200 opacity-60"></div>
                    </div>
                    <div className="pl-0">
                      <div className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>
                        Longer sessions create 73% better brand memory and recognition
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 mr-6">
                        <div className="text-5xl font-black text-blue-600 leading-none tracking-tight" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>87%</div>
                        <div className="text-sm font-bold text-gray-800 mt-2 tracking-wide" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>Return Rate</div>
                      </div>
                      <div className="flex-1 h-px bg-gray-200 opacity-60"></div>
                    </div>
                    <div className="pl-0">
                      <div className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>
                        Visitors who spend 3+ minutes return 87% more often
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interaction Impact Section */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              {/* Accent Bar */}
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-purple-600" />
              <div className="px-6 pt-5 pb-4">
                <h3 className="font-bold text-xl text-gray-900 mb-5" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>User Interactions Drive</h3>
              </div>
              <div className="px-6 pb-6">
                <div className="space-y-8">
                  <div className="group">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 mr-6">
                        <div className="text-5xl font-black text-purple-600 leading-none tracking-tight" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>5.2x</div>
                        <div className="text-sm font-bold text-gray-800 mt-2 tracking-wide" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>Conversion Rate</div>
                      </div>
                      <div className="flex-1 h-px bg-gray-200 opacity-60"></div>
                    </div>
                    <div className="pl-0">
                      <div className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>
                        Users who interact 4+ times convert 5.2x more than passive visitors
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 mr-6">
                        <div className="text-5xl font-black text-purple-600 leading-none tracking-tight" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>91%</div>
                        <div className="text-sm font-bold text-gray-800 mt-2 tracking-wide" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>Engagement Quality</div>
                      </div>
                      <div className="flex-1 h-px bg-gray-200 opacity-60"></div>
                    </div>
                    <div className="pl-0">
                      <div className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>
                        Sites with 3+ interactions show 91% higher engagement quality
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 mr-6">
                        <div className="text-5xl font-black text-purple-600 leading-none tracking-tight" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>3.8x</div>
                        <div className="text-sm font-bold text-gray-800 mt-2 tracking-wide" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>Share Rate</div>
                      </div>
                      <div className="flex-1 h-px bg-gray-200 opacity-60"></div>
                    </div>
                    <div className="pl-0">
                      <div className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>
                        Highly interactive visitors share content 3.8x more frequently
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO & Business Impact */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              {/* Accent Bar */}
              <div className="h-1 w-full bg-gradient-to-r from-green-500 to-green-600" />
              <div className="px-6 pt-5 pb-4">
                <h3 className="font-bold text-xl text-gray-900 mb-5" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>SEO & Growth</h3>
              </div>
              <div className="px-6 pb-6">
                <div className="space-y-8">
                  <div className="group">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 mr-6">
                        <div className="text-5xl font-black text-green-600 leading-none tracking-tight" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>45%</div>
                        <div className="text-sm font-bold text-gray-800 mt-2 tracking-wide" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>SEO Ranking Boost</div>
                      </div>
                      <div className="flex-1 h-px bg-gray-200 opacity-60"></div>
                    </div>
                    <div className="pl-0">
                      <div className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>
                        Google rewards sites with 2+ minute sessions with 45% better rankings
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 mr-6">
                        <div className="text-5xl font-black text-green-600 leading-none tracking-tight" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>67%</div>
                        <div className="text-sm font-bold text-gray-800 mt-2 tracking-wide" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>Lower Bounce Rate</div>
                      </div>
                      <div className="flex-1 h-px bg-gray-200 opacity-60"></div>
                    </div>
                    <div className="pl-0">
                      <div className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>
                        Interactive sites achieve 67% lower bounce rates than static ones
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 mr-6">
                        <div className="text-5xl font-black text-green-600 leading-none tracking-tight" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>2.1x</div>
                        <div className="text-sm font-bold text-gray-800 mt-2 tracking-wide" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>Organic Traffic Growth</div>
                      </div>
                      <div className="flex-1 h-px bg-gray-200 opacity-60"></div>
                    </div>
                    <div className="pl-0">
                      <div className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, Montserrat, Roboto, sans-serif' }}>
                        Engaged sites see 2.1x more organic traffic growth over time
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="px-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinueToModernSite}
              className="w-full text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontFamily: 'Inter, Montserrat, Roboto, sans-serif',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              Continue to Modern Site
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernSiteApp; 