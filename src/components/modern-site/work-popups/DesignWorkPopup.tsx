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
                src="/Websites_design.png"
                alt="Website Designs"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>

          {/* Mobile App UI Designs */}
          <div className="p-4 bg-black/30 border border-gray-800 rounded-lg hover:border-green-400 transition-colors">
            <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-2`}>
              Mobile App UI Designs
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Modern, intuitive mobile app interfaces designed for optimal user experience and engagement.
            </p>
            <div className="flex justify-center">
              <img
                src="/Mobile_App.png"
                alt="Mobile App UI Designs"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>

          {/* Logo Designs */}
          <div className="p-4 bg-black/30 border border-gray-800 rounded-lg hover:border-green-400 transition-colors">
            <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-2`}>
              Logo Designs
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Custom logo designs that capture brand identity and create memorable visual impressions.
            </p>
            <div className="flex justify-center">
              <img
                src="/Logo_Designs.png"
                alt="Logo Designs"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>

          {/* Print Designs */}
          <div className="p-4 bg-black/30 border border-gray-800 rounded-lg hover:border-green-400 transition-colors">
            <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-2`}>
              Print Designs
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Professional print materials including brochures, business cards, and marketing collateral.
            </p>
            <div className="flex justify-center">
              <img
                src="/Print_Designs.png"
                alt="Print Designs"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>

          {/* Posters */}
          <div className="p-4 bg-black/30 border border-gray-800 rounded-lg hover:border-green-400 transition-colors">
            <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-2`}>
              Posters
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Eye-catching poster designs for events, promotions, and brand awareness campaigns.
            </p>
            <div className="flex justify-center">
              <img
                src="/Posters.png"
                alt="Posters"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>

          {/* Flyers */}
          <div className="p-4 bg-black/30 border border-gray-800 rounded-lg hover:border-green-400 transition-colors">
            <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-2`}>
              Flyers
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Creative flyer designs that effectively communicate your message and drive engagement.
            </p>
            <div className="flex justify-center">
              <img
                src="/Flyers.png"
                alt="Flyers"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>

          {/* Quotation & Invoice Designs */}
          <div className="p-4 bg-black/30 border border-gray-800 rounded-lg hover:border-green-400 transition-colors">
            <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-2`}>
              Quotation & Invoice Designs
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Professional business document designs that maintain brand consistency and clarity.
            </p>
            <div className="flex justify-center">
              <img
                src="/Quotation_Invoices.png"
                alt="Quotation & Invoice Designs"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '400px' }}
              />
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
      </motion.div>
    </motion.div>
  );
};

export default DesignWorkPopup;