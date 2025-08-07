import React from 'react';
import { colors, typography } from '../../../theme/theme';
import { X, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SEOPopupProps {
  onClose: () => void;
}

const seoServices = [
  {
    id: 'seo-audit',
    title: 'SEO Audit',
    description: 'Comprehensive analysis to find SEO opportunities and issues.',
    icon: <Search size={32} className="text-green-400" />
  },
  {
    id: 'on-page-seo',
    title: 'On-Page SEO',
    description: 'Optimize content, structure, and meta tags for better rankings.',
    icon: <Search size={32} className="text-blue-400" />
  },
  {
    id: 'keyword-research',
    title: 'Keyword Research',
    description: 'Identify high-value keywords, analyze competitors, and target the best terms to boost your search visibility.',
    icon: <Search size={32} className="text-yellow-400" />
  },
  {
    id: 'content-strategy',
    title: 'Content Strategy',
    description: 'Plan and optimize content to target valuable keywords.',
    icon: <Search size={32} className="text-pink-400" />
  },
  {
    id: 'link-building',
    title: 'Link Building',
    description: 'Earn high-quality backlinks to boost authority and rankings.',
    icon: <Search size={32} className="text-purple-400" />
  },
  {
    id: 'local-seo',
    title: 'Local SEO',
    description: 'Optimize for local search and Google Maps visibility.',
    icon: <Search size={32} className="text-orange-400" />
  },
  {
    id: 'analytics-tracking',
    title: 'Analytics & Tracking',
    description: 'Set up and monitor analytics to measure SEO performance.',
    icon: <Search size={32} className="text-indigo-400" />
  },
  {
    id: 'seo-consulting',
    title: 'SEO Consulting',
    description: 'Expert guidance and strategy for your SEO goals.',
    icon: <Search size={32} className="text-cyan-400" />
  },
  {
    id: 'ecommerce-seo',
    title: 'E-commerce SEO',
    description: 'SEO strategies tailored for online stores to drive sales.',
    icon: <Search size={32} className="text-red-400" />
  },
];

const SEOPopup: React.FC<SEOPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.orange; // #FF6600
  const isMobile = window.innerWidth <= 768;

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
          <div className="flex items-center gap-3">
            <img src="/SEO.png" alt="SEO" className="w-8 h-8 rounded-full" />
            <h2 className={`${typography.fontSize['2xl']} ${typography.fontFamily.light} ${typography.tracking.tight} text-white`}>
              SEO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seoServices.map((service) => (
              <motion.div
                key={service.id}
                className="bg-black/30 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
                whileHover={{ y: -5 }}
              >
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-2`}>
                  {service.title}
                </h3>
                <p className={`${typography.fontSize.sm} ${typography.fontFamily.light} ${typography.tracking.tight} text-gray-400`}>
                  {service.description}
                </p>
              </motion.div>
            ))}
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

export default SEOPopup; 