import React, { useState } from 'react';
import { colors, typography } from '../../../theme/theme';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DesignWorkPopupProps {
  onClose: () => void;
}

const DesignWorkPopup: React.FC<DesignWorkPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.green; // #00CC66
  const isMobile = window.innerWidth <= 768;
  const [selectedLogo, setSelectedLogo] = useState<number | null>(null);
  
  // Logo designs from branding popup (first 2 rows = 8 logos)
  const logoImages = Array.from({ length: 8 }, (_, i) => `/Branding/logo${i + 1}.png`);
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-[#1a1a1a] rounded-lg border border-gray-800 w-full max-w-5xl max-h-[90vh] overflow-auto"
        style={isMobile ? { width: '100%', height: '100%', maxHeight: '100vh', borderRadius: 0 } : {}}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className={`${typography.fontSize['2xl']} ${typography.fontFamily.light} ${typography.tracking.tight} text-white`}>
            Design
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Mobile App UI Design */}
          <div className="p-4 bg-black/30 border border-gray-800 rounded-lg hover:border-green-400 transition-colors">
            <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-2`}>
              Mobile App UI Design
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Modern, intuitive mobile app interfaces designed for optimal user experience and engagement.
            </p>
            <div className="flex justify-center">
              <img
                src="/apps.png"
                alt="Mobile App UI Design"
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Webapp UI Kits */}
          <div className="p-4 bg-black/30 border border-gray-800 rounded-lg hover:border-green-400 transition-colors">
            <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-2`}>
              Webapp UI Kits
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Comprehensive UI component libraries and design systems for web applications.
            </p>
            <div className="flex justify-center">
              <img
                src="/Web_Apps.png"
                alt="Webapp UI Kits"
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Website Designs */}
          <div className="p-4 bg-black/30 border border-gray-800 rounded-lg hover:border-green-400 transition-colors">
            <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-2`}>
              Website Designs
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Custom website designs that combine aesthetics with functionality for modern businesses.
            </p>
            <div className="flex justify-center">
              <img
                src="/website_designs.png"
                alt="Website Designs"
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Logo Designs Section */}
          <div className="p-4 bg-black/30 border border-gray-800 rounded-lg hover:border-green-400 transition-colors">
            <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-2`}>
              Logo Designs
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Custom logo designs that capture brand identity and create memorable visual impressions.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {logoImages.map((src, idx) => (
                <button
                  key={src}
                  className="group block bg-black/30 border border-gray-800 rounded-lg overflow-hidden hover:border-green-400 transition-colors shadow-lg focus:outline-none"
                  onClick={() => setSelectedLogo(idx)}
                >
                  <div className="aspect-square flex items-center justify-center p-4">
                    <img
                      src={src}
                      alt={`Logo ${idx + 1}`}
                      className="object-contain w-full h-full group-hover:opacity-90 transition-opacity duration-200"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-black rounded-md transition-colors duration-300 text-sm font-light tracking-tight"
            style={{ 
              backgroundColor: buttonColor,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = `${buttonColor}dd`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = buttonColor;
            }}
          >
            Close
          </button>
        </div>

        {/* Logo Modal */}
        <AnimatePresence>
          {selectedLogo !== null && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLogo(null)}
            >
              <motion.div
                className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6 shadow-lg max-w-2xl w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-light">Logo Design {selectedLogo + 1}</h3>
                  <button
                    onClick={() => setSelectedLogo(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src={logoImages[selectedLogo]}
                    alt={`Logo ${selectedLogo + 1}`}
                    className="max-w-full max-h-96 object-contain"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default DesignWorkPopup;