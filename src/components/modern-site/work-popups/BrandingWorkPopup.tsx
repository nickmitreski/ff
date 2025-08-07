import React, { useState } from 'react';
import { colors, typography } from '../../../theme/theme';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrandingWorkPopupProps {
  onClose: () => void;
}

const logoImages = Array.from({ length: 16 }, (_, i) => `/Branding/logo${i + 1}.png`);
const fontImages = Array.from({ length: 8 }, (_, i) => `/Branding/font${i + 1}.png`);

const animatedLogos = [
  {
    video: 'https://file.garden/Zxsc5-9aojhlnJO6/video_logos/1.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/animated_thumbnails/a1.png',
  },
  {
    video: 'https://file.garden/Zxsc5-9aojhlnJO6/video_logos/2.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/animated_thumbnails/a2.png',
  },
  {
    video: 'https://file.garden/Zxsc5-9aojhlnJO6/video_logos/3.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/animated_thumbnails/a3.png',
  },
  {
    video: 'https://file.garden/Zxsc5-9aojhlnJO6/video_logos/4.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/animated_thumbnails/a4.png',
  },
  {
    video: 'https://file.garden/Zxsc5-9aojhlnJO6/video_logos/5.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/animated_thumbnails/a5.png',
  },
  {
    video: 'https://file.garden/Zxsc5-9aojhlnJO6/video_logos/6.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/animated_thumbnails/a6.png',
  },
  {
    video: 'https://file.garden/Zxsc5-9aojhlnJO6/video_logos/7.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/animated_thumbnails/a7.png',
  },
  {
    video: 'https://file.garden/Zxsc5-9aojhlnJO6/video_logos/8.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/animated_thumbnails/a8.png',
  },
];

const THUMBNAIL_STYLE = {
  width: '100%',
  aspectRatio: '16/9',
  minWidth: 0,
  minHeight: 0,
  maxWidth: 240,
};

const BrandingWorkPopup: React.FC<BrandingWorkPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.pink; // #FF1493
  const isMobile = window.innerWidth <= 768;
  const [selectedAnimated, setSelectedAnimated] = useState<number | null>(null);

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
          <h2 className="text-2xl font-light tracking-tight text-white">
            Branding
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-10">
          {/* Logos Section */}
          <div>
            <h3 className="text-2xl font-bold lowercase text-pink-400 mb-4 text-center">logos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {logoImages.map((src, idx) => (
                <div
                  key={src}
                  className="bg-black/30 border border-gray-800 rounded-lg overflow-hidden shadow-md flex items-center justify-center"
                  style={THUMBNAIL_STYLE}
                >
                  <img
                    src={src}
                    alt={`Logo ${idx + 1}`}
                    className="object-contain w-full h-full"
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Animated Logos Section */}
          <div>
            <h3 className="text-2xl font-bold lowercase text-pink-400 mb-1 text-center">animated logos</h3>
            <div className="text-xs text-gray-400 text-center mb-4">click a thumbnail to view animation</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {animatedLogos.map((item, idx) => (
                <button
                  key={item.thumbnail}
                  className="group block bg-black/30 border border-gray-800 rounded-lg overflow-hidden hover:border-pink-400 transition-colors shadow-lg focus:outline-none"
                  style={THUMBNAIL_STYLE}
                  onClick={() => setSelectedAnimated(idx)}
                >
                  <img
                    src={item.thumbnail}
                    alt={`Animated Logo ${idx + 1}`}
                    className="object-contain w-full h-full group-hover:opacity-90 transition-opacity duration-200"
                    style={{ height: '100%', width: '100%' }}
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Fonts Section */}
          <div>
            <h3 className="text-2xl font-bold lowercase text-pink-400 mb-4 text-center">custom fonts</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {fontImages.map((src, idx) => (
                <div
                  key={src}
                  className="bg-black/30 border border-gray-800 rounded-lg overflow-hidden shadow-md flex items-center justify-center"
                  style={THUMBNAIL_STYLE}
                >
                  <img
                    src={src}
                    alt={`Font ${idx + 1}`}
                    className="object-contain w-full h-full"
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
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
        <AnimatePresence>
          {selectedAnimated !== null && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAnimated(null)}
            >
              <motion.div
                className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-4 shadow-lg"
                style={{ width: '90vw', maxWidth: 800 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-light">Animated Logo</h3>
                  <button
                    onClick={() => setSelectedAnimated(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <video
                    src={animatedLogos[selectedAnimated].video}
                    controls
                    style={{ width: '100%', height: '100%', maxWidth: 800, maxHeight: 450, background: 'black' }}
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

export default BrandingWorkPopup;