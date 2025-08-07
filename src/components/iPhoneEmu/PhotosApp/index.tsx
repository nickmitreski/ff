import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhotosHeader from './PhotosHeader';

interface PhotosAppProps {
  onClose: () => void;
}

interface Photo {
  id: number;
  src: string;
  title: string;
  alt: string;
}

// 2007 themed photos
const photos2007: Photo[] = [
  { id: 1, src: '/2007_images/Couple_Goals.png', title: 'Couple Goals', alt: 'Couple Goals 2007' },
  { id: 2, src: '/2007_images/McLovin.png', title: 'McLovin', alt: 'McLovin ID Card' },
  { id: 3, src: '/2007_images/NBA_Champs.png', title: 'NBA Champs', alt: 'NBA Champions 2007' },
  { id: 4, src: '/2007_images/Backstreet.png', title: 'Backstreet Boys', alt: 'Backstreet Boys' },
  { id: 5, src: '/2007_images/Its_Britney.png', title: "It's Britney", alt: "It's Britney Bitch" },
  { id: 6, src: '/2007_images/TShirt_Time.png', title: 'T-Shirt Time', alt: 'T-Shirt Time' },
];

const PhotosApp: React.FC<PhotosAppProps> = ({ onClose }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      <PhotosHeader />
      
      <div className="flex-1 bg-gradient-to-b from-gray-100 to-white overflow-y-auto">
        {/* Album Title */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="photos-album-title">2007 Memories</h2>
          <p className="photos-album-count">{photos2007.length} photos</p>
        </div>

        {/* Photos Grid */}
        <div className="p-0">
          <div className="photos-grid">
            {photos2007.map((photo) => (
              <motion.div
                key={photo.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPhoto(photo)}
                className="aspect-square photo-thumb cursor-pointer"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNS40IDM1LjRINjQuNlY2NC42SDM1LjRWMzUuNFoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iNDMiIGN5PSI0MyIgcj0iMyIgZmlsbD0iI0E3QjJCOCIvPgo8cGF0aCBkPSJNNTIgNTJMNjAgNDRMNjQgNDhMNjAgNjBINDBMNDggNTJINTJaIiBmaWxsPSIjQTdCMkI4Ii8+Cjwvc3ZnPgo=';
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Photo Viewer Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', bounce: 0.25 }}
                className="relative max-w-[90vw] max-h-[90vh] mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Photo */}
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  className="w-full h-full object-contain rounded-lg shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNS40IDM1LjRINjQuNlY2NC42SDM1LjRWMzUuNFoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iNDMiIGN5PSI0MyIgcj0iMyIgZmlsbD0iI0E3QjJCOCIvPgo8cGF0aCBkPSJNNTIgNTJMNjAgNDRMNjQgNDhMNjAgNjBINDBMNDggNTJINTJaIiBmaWxsPSIjQTdCMkI4Ii8+Cjwvc3ZnPgo=';
                  }}
                />
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                  <h3 className="text-white text-lg font-semibold">{selectedPhoto.title}</h3>
                  <p className="text-white/80 text-sm">2007 Collection</p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg transition-colors"
                >
                  ×
                </button>

                {/* Navigation Buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = photos2007.findIndex(p => p.id === selectedPhoto.id);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos2007.length - 1;
                    setSelectedPhoto(photos2007[prevIndex]);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg transition-colors"
                >
                  ‹
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = photos2007.findIndex(p => p.id === selectedPhoto.id);
                    const nextIndex = currentIndex < photos2007.length - 1 ? currentIndex + 1 : 0;
                    setSelectedPhoto(photos2007[nextIndex]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg transition-colors"
                >
                  ›
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PhotosApp; 