import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import YouTubeHeader from './YouTubeHeader';
import './YouTubeApp.css';
import { config } from '../../../lib/config';

interface Video {
  id: string;
  title: string;
  channel: string;
  views: string;
  duration: string;
  thumbnail: string;
  uploaded: string;
}

interface YouTubeAppProps {
  onClose: () => void;
}

// TypeScript: declare YT on window for YouTube IFrame Player API
declare global {
  interface Window {
    YT: any;
  }
}

// Recommended video IDs
const RECOMMENDED_VIDEO_IDS = [
  'eR2zafZ9snY',
  'J---aiyznGQ',
  'lj3iNxZ8Dww',
  '0EqSXDwTq6U',
  'B0Gd-bx3RD0',
];

const YouTubeApp: React.FC<YouTubeAppProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const [recommended, setRecommended] = useState<any[]>([]);

  const getYoutubeApiKey = () => config.google.youtubeApiKey;

  const fetchVideos = async (query: string) => {
    setLoading(true);
    setVideos([]);
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(query)}&key=${getYoutubeApiKey()}`);
      const data = await res.json();
      setVideos(data.items || []);
    } catch (e) {
      setVideos([]);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) fetchVideos(searchQuery);
  };

  const handleVideoClick = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const handleBackToList = () => {
    setSelectedVideoId(null);
    if (playerRef.current) playerRef.current.innerHTML = '';
  };

  // Fetch recommended videos on mount
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const ids = RECOMMENDED_VIDEO_IDS.join(',');
        const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids}&key=${getYoutubeApiKey()}`);
        const data = await res.json();
        setRecommended(data.items || []);
      } catch (e) {
        setRecommended([]);
      }
    };
    fetchRecommended();
  }, []);

  useEffect(() => {
    if (selectedVideoId && playerRef.current) {
      // Load YouTube IFrame Player API if not already loaded
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
      // Wait for YT to be available
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(interval);
          // Render the player
          new window.YT.Player(playerRef.current, {
            height: '220',
            width: '100%',
            videoId: selectedVideoId,
            playerVars: { 'autoplay': 1, 'controls': 1, 'modestbranding': 1 },
          });
        }
      }, 100);
    }
  }, [selectedVideoId]);

  return (
    <motion.div
      className="youtube-app"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <YouTubeHeader />
      <div className="youtube-content">
        {/* Search Bar */}
        <div className="search-section">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-button" type="submit">
              <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="2" fill="none" />
                <rect x="14" y="14" width="4" height="2" rx="1" transform="rotate(45 14 14)" fill="#fff" />
              </svg>
            </button>
          </form>
        </div>
        {/* Video List / Recommended */}
        <div className="videos-section">
          {searchQuery ? (
            <>
              <h3 className="section-title">Search Results for "{searchQuery}"</h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Loading…</div>
              ) : (
                <div className="video-list">
                  {videos.map((video) => (
                    <div
                      key={video.id.videoId}
                      className="video-item"
                      onClick={() => handleVideoClick(video.id.videoId)}
                    >
                      <div className="video-thumbnail">
                        <img
                          src={video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                          style={{ width: 80, height: 60, borderRadius: 3, objectFit: 'cover' }}
                        />
                      </div>
                      <div className="video-details">
                        <h4 className="video-title">{video.snippet.title}</h4>
                        <p className="channel-name">{video.snippet.channelTitle}</p>
                        <p className="video-meta">{new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="section-title">Recommended Videos</h3>
              <div className="video-list">
                {recommended.map((video) => (
                  <div
                    key={video.id}
                    className="video-item"
                    onClick={() => handleVideoClick(video.id)}
                  >
                    <div className="video-thumbnail">
                      <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        style={{ width: 80, height: 60, borderRadius: 3, objectFit: 'cover' }}
                      />
                    </div>
                    <div className="video-details">
                      <h4 className="video-title">{video.snippet.title}</h4>
                      <p className="channel-name">{video.snippet.channelTitle}</p>
                      <p className="video-meta">{new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Video Modal */}
        {selectedVideoId && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" style={{ top: 0, left: 0 }}>
            <div style={{ background: '#111', borderRadius: 12, padding: 12, width: 340, maxWidth: '95vw', boxShadow: '0 4px 24px #0008' }}>
              <div ref={playerRef} style={{ width: '100%', height: 220, borderRadius: 8, overflow: 'hidden', background: '#000' }} />
              <button className="search-button" style={{ marginTop: 12, width: '100%' }} onClick={handleBackToList}>Close</button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default YouTubeApp; 