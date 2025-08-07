import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppStoreHeader from './AppStoreHeader';

interface AppStoreAppProps {
  onClose: () => void;
}

interface App {
  id: string;
  name: string;
  developer: string;
  rating: number;
  price: string;
  icon: string;
  category: string;
  description: string;
  screenshots: string[];
}

const AppStoreApp: React.FC<AppStoreAppProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const apps: App[] = [
    { 
      id: '1', 
      name: 'Angry Birds', 
      developer: 'Rovio Entertainment', 
      rating: 4.5, 
      price: '$0.99', 
      icon: '🎯', 
      category: 'Games',
      description: 'Use the unique powers of the Angry Birds to destroy the greedy pigs\' defenses!',
      screenshots: ['📱', '🎮', '🎯']
    },
    { 
      id: '2', 
      name: 'Instagram', 
      developer: 'Instagram, Inc.', 
      rating: 4.2, 
      price: 'Free', 
      icon: '📷', 
      category: 'Photo & Video',
      description: 'Bringing you closer to the people and things you love.',
      screenshots: ['📷', '📸', '🎨']
    },
    { 
      id: '3', 
      name: 'Spotify Music', 
      developer: 'Spotify AB', 
      rating: 4.3, 
      price: 'Free', 
      icon: '🎵', 
      category: 'Music',
      description: 'Play millions of songs and podcasts on your device.',
      screenshots: ['🎵', '🎧', '🎶']
    },
    { 
      id: '4', 
      name: 'WhatsApp Messenger', 
      developer: 'WhatsApp Inc.', 
      rating: 4.4, 
      price: 'Free', 
      icon: '💬', 
      category: 'Social Networking',
      description: 'Simple. Secure. Reliable messaging.',
      screenshots: ['💬', '📞', '📱']
    },
    { 
      id: '5', 
      name: 'TikTok', 
      developer: 'TikTok Pte. Ltd.', 
      rating: 4.1, 
      price: 'Free', 
      icon: '🎬', 
      category: 'Entertainment',
      description: 'Make Your Day. Discover videos, music and live streams.',
      screenshots: ['🎬', '🎭', '🎪']
    },
    { 
      id: '6', 
      name: 'Netflix', 
      developer: 'Netflix, Inc.', 
      rating: 4.0, 
      price: 'Free', 
      icon: '🎬', 
      category: 'Entertainment',
      description: 'Watch TV shows & movies including award-winning Netflix originals.',
      screenshots: ['🎬', '📺', '🍿']
    }
  ];

  const categories = ['All', 'Games', 'Photo & Video', 'Music', 'Social Networking', 'Entertainment'];

  const filteredApps = selectedCategory === 'All' 
    ? apps 
    : apps.filter(app => app.category === selectedCategory);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-300">★</span>);
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      <AppStoreHeader onClose={onClose} />
      
      {/* Scrollable Content */}
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        {/* Search Bar */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center">
            <span className="text-gray-400 mr-2">🔍</span>
            <input 
              type="text" 
              placeholder="Search apps, games, and more..."
              className="bg-transparent flex-1 text-sm outline-none"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured App Banner */}
        <div className="bg-white mx-4 mt-4 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                🎯
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">App of the Day</h3>
                <p className="text-sm opacity-90">Angry Birds</p>
                <p className="text-xs opacity-75 mt-1">The original bird-flinging adventure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Apps List */}
        <div className="px-4 pb-4">
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {selectedCategory === 'All' ? 'Top Apps' : `${selectedCategory} Apps`}
            </h2>
            <div className="space-y-3">
              {filteredApps.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="bg-white rounded-xl p-4 shadow-sm cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    {/* App Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-3xl shadow-sm">
                      {app.icon}
                    </div>
                    
                    {/* App Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{app.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{app.developer}</p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{app.description}</p>
                        </div>
                        
                        {/* Price & Get Button */}
                        <div className="ml-4 flex flex-col items-end">
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm font-semibold transition-colors">
                            {app.price === 'Free' ? 'GET' : app.price}
                          </button>
                          <p className="text-xs text-gray-400 mt-1">In-App Purchases</p>
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center mt-2 space-x-2">
                        <div className="flex">{renderStars(app.rating)}</div>
                        <span className="text-sm text-gray-500">{app.rating}</span>
                        <span className="text-xs text-gray-400">#{index + 1} in {app.category}</span>
                      </div>
                      
                      {/* Screenshots */}
                      <div className="flex space-x-2 mt-3">
                        {app.screenshots.map((screenshot, idx) => (
                          <div key={idx} className="w-12 h-8 bg-gray-100 rounded border flex items-center justify-center text-xs">
                            {screenshot}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppStoreApp; 