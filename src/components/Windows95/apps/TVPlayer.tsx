import React, { useState, useEffect, useRef, memo, useCallback } from 'react';

interface Channel {
  name: string;
  icon: string;
  description: string;
  shows: Show[];
}

interface Show {
  title: string;
  duration: string;
  description: string;
  videoUrl?: string;
}

// Initial channel data structure with hardcoded URLs
const initialChannels: Channel[] = [
  {
    name: 'MTV',
    icon: '/MediaAudio_32x32_4.png',
    description: 'Music Television - Your #1 source for music videos and entertainment',
    shows: [
      { title: 'MTV Classic', duration: 'N/A', description: 'Classic MTV content', videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/90stv/MTV.mp4' },
    ],
  },
  {
    name: 'Sitcoms',
    icon: '/TV.png',
    description: 'Classic sitcoms from the 90s',
    shows: [
      { title: 'Perfect Strangers', duration: 'N/A', description: 'Balki and Larry\'s adventures', videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/90stv/PerfectStrangers.mp4' },
    ],
  },
  {
    name: 'Cartoons',
    icon: '/Network2_32x32_4.png',
    description: 'Your favorite animated shows',
    shows: [
      { title: 'Samurai Pizza Cats', duration: 'N/A', description: 'Awesome feline heroes', videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/90stv/SamuraPizzaCats.mp4' },
    ],
  },
  {
    name: 'News',
    icon: '/Mailnews13_32x32_4.png',
    description: '24/7 News Coverage',
    shows: [
      { title: '96 News', duration: 'N/A', description: 'News from 1996', videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/90stv/news96.mp4' },
    ],
  },
  {
    name: 'Game Shows',
    icon: '/Controls3000_32x32_4.png',
    description: 'Test your knowledge with classic game shows',
    shows: [
      { title: 'Wheel', duration: 'N/A', description: 'Spin the wheel!', videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/90stv/Wheel.mp4' },
    ],
  },
];

const TVPlayer: React.FC = () => {
  const [channels] = useState<Channel[]>(initialChannels);
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  // Effect to set the initial video and update when channel or show changes
  useEffect(() => {
    if (channels.length > 0) {
      const channel = channels[currentChannelIndex];
      if (channel && channel.shows.length > 0) {
        const validShowIndex = Math.min(currentShowIndex, channel.shows.length - 1);
        setCurrentShowIndex(validShowIndex);
        const videoUrl = channel.shows[validShowIndex].videoUrl;
        setCurrentVideoUrl(videoUrl);
        setIsLoading(true);
        setError(null);

        // Reset aspect ratio when channel or show changes
        setAspectRatio(undefined);
      } else {
        setCurrentVideoUrl(undefined);
        setError('No shows available in this channel');
      }
    } else {
      setCurrentVideoUrl(undefined);
      setError('No channels available');
    }
  }, [channels, currentChannelIndex, currentShowIndex]);

  // Handler for when video metadata is loaded
  const handleLoadedMetadata = useCallback(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
      setAspectRatio(videoAspectRatio);
      setIsLoading(false);
    }
  }, []);

  const handleVideoError = useCallback(() => {
    setError('Failed to load video. Please try another channel.');
    setIsLoading(false);
  }, []);

  const handleNextChannel = useCallback(() => {
    const nextChannelIndex = (currentChannelIndex + 1) % channels.length;
    setCurrentChannelIndex(nextChannelIndex);
    setCurrentShowIndex(0);
  }, [currentChannelIndex, channels.length]);

  const handlePreviousChannel = useCallback(() => {
    const prevChannelIndex = (currentChannelIndex - 1 + channels.length) % channels.length;
    setCurrentChannelIndex(prevChannelIndex);
    setCurrentShowIndex(0);
  }, [currentChannelIndex, channels.length]);

  const handleNextShow = useCallback(() => {
    const currentChannel = channels[currentChannelIndex];
    if (currentChannel && currentChannel.shows.length > 0) {
      const nextShowIndex = (currentShowIndex + 1) % currentChannel.shows.length;
      setCurrentShowIndex(nextShowIndex);
    } else {
      handleNextChannel();
    }
  }, [currentChannelIndex, currentShowIndex, channels, handleNextChannel]);

  const handleVideoEnded = useCallback(() => {
    handleNextShow();
  }, [handleNextShow]);

  const currentChannel = channels[currentChannelIndex];
  const currentShow = currentChannel?.shows[currentShowIndex];

  return (
    <div className="p-2 h-full flex flex-col bg-[var(--win95-window-bg)]">
      {/* TV Screen */}
      <div 
        className="bg-black border-4 border-[var(--win95-border-inner-dark)] mb-2 relative"
        style={{
          width: '100%',
          paddingTop: aspectRatio ? `${100 / aspectRatio}%` : '56.25%',
          position: 'relative',
        }}
      >
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-white text-center">
              <div className="mb-4">
                <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <div>Loading Channel...</div>
            </div>
          </div>
        )}
        
        {/* Error Display */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-red-500 text-center p-4 bg-black/50">
              <div className="mb-2 text-xl">ERROR</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Video Player */}
        {currentVideoUrl && (
          <video 
            ref={videoRef}
            src={currentVideoUrl}
            controls={false}
            autoPlay
            className="absolute top-0 left-0 w-full h-full object-contain"
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            onLoadedMetadata={handleLoadedMetadata}
          />
        )}
        
        {/* No Signal Display */}
        {!currentVideoUrl && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="text-gray-500 text-2xl">
              <div className="mb-4">NO SIGNAL</div>
              {channels.length === 0 ? (
                <div className="text-xl">Loading Channels...</div>
              ) : currentChannel && currentChannel.shows.length === 0 ? (
                <div className="text-xl">No videos in this channel.</div>
              ) : (
                <div className="text-xl">No Video</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-[var(--win95-window-bg)] p-2 border-2 border-[var(--win95-border-inner-dark)]">
        <div className="flex gap-2 mb-2 justify-center">
          <button 
            className="win95-button flex-1"
            onClick={handlePreviousChannel}
            disabled={channels.length <= 1 || isLoading}
          >
            ⏪ Prev Channel
          </button>
          <button 
            className="win95-button flex-1"
            onClick={handleNextChannel}
            disabled={channels.length <= 1 || isLoading}
          >
            Next Channel ⏩
          </button>
        </div>

        {/* Channel Info */}
        <div className="text-center text-sm">
          <p>Channel: {currentChannel?.name || 'Loading...'}</p>
          <p>Show: {currentShow?.title || 'Loading...'}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(TVPlayer);