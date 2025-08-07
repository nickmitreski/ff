import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VideosHeader from './VideosHeader';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: string;
  category: string;
}

// Videos from the Windows media folder
const flashForwardVideos: Video[] = [
  {
    id: 'news',
    title: 'Flash Forward News',
    description: 'Collection of news videos featuring Flash Forward Digital in the spotlight',
    url: 'https://file.garden/Zxsc5-9aojhlnJO6/news_promo.mp4',
    thumbnail: '/news_thumbnail.png',
    duration: '2:15',
    category: 'News'
  },
  {
    id: 'promo',
    title: 'Flash Forward Digital',
    description: 'Official promotional video showcasing Flash Forward Digital agency services',
    url: 'https://file.garden/Zxsc5-9aojhlnJO6/flashforowarddraft.mp4',
    thumbnail: '/promo_thumbnail.png',
    duration: '1:45',
    category: 'Promo'
  },
  {
    id: 'content',
    title: 'Content Creation Services',
    description: 'Detailed explanation of our professional content creation services and process',
    url: 'https://file.garden/Zxsc5-9aojhlnJO6/content_promo.mp4',
    thumbnail: '/content_thumbnail.png',
    duration: '3:20',
    category: 'Services'
  }
];

const VideosApp: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      <VideosHeader />
      
      <div className="flex-1 overflow-hidden">
        {!selectedVideo ? (
          // Video List View
          <div className="h-full bg-gray-100 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Flash Forward Videos</h2>
              <div className="space-y-3">
                {flashForwardVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    onClick={() => handleVideoSelect(video)}
                    className="flex items-center p-3 bg-white rounded-lg shadow-sm cursor-pointer border border-gray-200"
                  >
                    <div className="relative flex-shrink-0 mr-3">
                      <div className="w-20 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded overflow-hidden relative">
                        {/* 2007 iPhone style video thumbnail with play button overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 bg-black bg-opacity-60 rounded-full flex items-center justify-center border border-white/30">
                            <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-1"></div>
                          </div>
                        </div>
                        {/* Category badge */}
                        <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                          {video.category}
                        </div>
                        {/* Duration */}
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                          {video.duration}
                        </div>
                        {/* Video thumbnail pattern overlay */}
                        <div className="absolute inset-0 opacity-30">
                          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate mb-1">{video.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{video.description}</p>
                    </div>
                    <div className="text-gray-400 ml-2 text-lg">›</div>
                  </motion.div>
                ))}
              </div>
              
              {/* Footer info */}
              <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 text-center">
                  📱 Optimized for iPhone • Flash Forward Digital 2007
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Video Player View
          <div className="h-full bg-black flex flex-col">
            <div className="flex-1 flex items-center justify-center relative">
              <video
                key={selectedVideo.url}
                controls
                autoPlay
                preload="metadata"
                className="w-full h-full object-contain"
                style={{ maxHeight: '100%' }}
                onLoadStart={() => {
                  // Ensure video starts loading immediately
                }}
                onCanPlay={() => {
                  // Video is ready to play
                }}
              >
                <source src={selectedVideo.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4 bg-gray-900 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-blue-400 font-medium">{selectedVideo.category}</span>
                <span className="text-xs text-gray-400">{selectedVideo.duration}</span>
              </div>
              <h3 className="text-white font-medium text-sm mb-1">{selectedVideo.title}</h3>
              <p className="text-gray-300 text-xs leading-relaxed">{selectedVideo.description}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideosApp; 