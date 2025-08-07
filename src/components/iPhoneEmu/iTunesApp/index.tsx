import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ITunesHeader from './iTunesHeader';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  trackNumber: number;
  year: number;
  url?: string; // <-- Add url property
}

const ITunesApp: React.FC = () => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Only include songs with valid URLs
  const songs: Song[] = [
    { id: 2, title: 'Rihanna - Umbrella', artist: 'Rihanna', album: 'Good Girl Gone Bad', duration: '4:36', genre: 'Pop', trackNumber: 2, year: 2007, url: 'https://file.garden/Zxsc5-9aojhlnJO6/2007_songs/Rihanna%20-%20Umbrella.mp3' },
    { id: 3, title: 'Ne-Yo - So Sick', artist: 'Ne-Yo', album: 'In My Own Words', duration: '3:27', genre: 'R&B', trackNumber: 3, year: 2006, url: 'https://file.garden/Zxsc5-9aojhlnJO6/2007_songs/Ne-Yo%20-%20So%20Sick.mp3' },
    { id: 4, title: 'Hips Don\'t Lie (ft. Wyclef Jean)', artist: 'Shakira ft. Wyclef Jean', album: 'Oral Fixation, Vol. 2', duration: '3:38', genre: 'Latin Pop', trackNumber: 4, year: 2006, url: 'https://file.garden/Zxsc5-9aojhlnJO6/2007_songs/Hips%20Don\'t%20Lie%20-%20Shakira%20Ft.%20Wyclef%20Jean.mp3' },
    { id: 5, title: 'Sean Kingston - Beautiful Girls', artist: 'Sean Kingston', album: 'Sean Kingston', duration: '3:43', genre: 'Reggae', trackNumber: 5, year: 2007, url: 'https://file.garden/Zxsc5-9aojhlnJO6/2007_songs/Beautiful%20Girls%20(Radio%20Edit).mp3' },
    { id: 6, title: 'Sean Paul - Temperature', artist: 'Sean Paul', album: 'The Trinity', duration: '3:36', genre: 'Dancehall', trackNumber: 6, year: 2005, url: 'https://file.garden/Zxsc5-9aojhlnJO6/2007_songs/Sean%20Paul-Temperature.mp3' },
    { id: 7, title: 'Mario - Let Me Love You', artist: 'Mario', album: 'Turning Point', duration: '4:09', genre: 'R&B', trackNumber: 7, year: 2004, url: 'https://file.garden/Zxsc5-9aojhlnJO6/2007_songs/Mario%20-%20Let%20Me%20Love%20You%20%2094bpm.mp3' },
    { id: 8, title: 'Justin Timberlake - SexyBack', artist: 'Justin Timberlake', album: 'FutureSex/LoveSounds', duration: '4:02', genre: 'Pop', trackNumber: 8, year: 2006, url: 'https://file.garden/Zxsc5-9aojhlnJO6/2007_songs/SexyBack%20(Dirty).mp3' },
    { id: 9, title: 'Ne-Yo - Because Of You', artist: 'Ne-Yo', album: 'Because of You', duration: '3:47', genre: 'R&B', trackNumber: 9, year: 2007, url: 'https://file.garden/Zxsc5-9aojhlnJO6/2007_songs/Ne-Yo%20-%20Because%20Of%20You.mp3' },
    // Add more songs here with valid URLs if available
  ];

  // Add a ref for the audio element
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const playSong = (song: Song) => {
    setSelectedSong(song);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current && song.url) {
        audioRef.current.src = song.url;
        audioRef.current.play();
      }
    }, 0);
  };

  const togglePlayPause = () => {
    if (!selectedSong || !selectedSong.url) return;
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Album artwork mapping by song title (or unique identifier)
  const artworkMap: { [key: string]: string } = {
    'Rihanna - Umbrella': '/public/2007_songs_artwork/umbrella.png',
    'Ne-Yo - So Sick': '/public/2007_songs_artwork/so_sick.png',
    'Hips Don\'t Lie (ft. Wyclef Jean)': '/public/2007_songs_artwork/Hips_dont_lie.png',
    'Sean Kingston - Beautiful Girls': '/public/2007_songs_artwork/Sean_Kingston.png',
    'Sean Paul - Temperature': '/public/2007_songs_artwork/Temperature.png',
    'Mario - Let Me Love You': '/public/2007_songs_artwork/Mario.png',
    'Justin Timberlake - SexyBack': '/public/2007_songs_artwork/Sexyback.png',
    'Ne-Yo - Because Of You': '/public/2007_songs_artwork/Because_of_you.png',
    // Add more mappings as needed
  };

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      <ITunesHeader />
      
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {/* Library Header */}
        <div className="px-4 py-3 bg-gradient-to-b from-gray-100 to-gray-200 border-b border-gray-300">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Music Library</h2>
          <div className="text-sm text-gray-600">{songs.length} songs • 2006-2007 Hits</div>
        </div>

        {/* Column Headers */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <div className="w-8 text-center">#</div>
          <div className="flex-1 px-2">Song</div>
          <div className="w-16 text-center">Time</div>
          <div className="w-16 text-center">Genre</div>
        </div>

        {/* Songs List - Scrollable */}
        <div className="flex-1 overflow-y-auto max-h-[350px]">
          {songs.filter(song => song.url).map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={() => playSong(song)}
              className={`flex items-center px-4 py-2 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedSong?.id === song.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              {/* Track Number */}
              <div className="w-8 text-center">
                <span className="text-sm text-gray-500">{song.trackNumber}</span>
              </div>
              
              {/* Song Info */}
              <div className="flex-1 px-2 min-w-0">
                <div className="flex items-center space-x-3">
                  {/* Album Art Placeholder */}
                  <div className="w-10 h-10 rounded-md flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden bg-gray-200">
                    <img
                      src={artworkMap[song.title] || ''}
                      alt={song.title + ' artwork'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Song Details */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{song.title}</h3>
                    <p className="text-xs text-gray-500 truncate">{song.artist} • {song.album}</p>
                  </div>
                </div>
              </div>
              
              {/* Duration */}
              <div className="w-16 text-center">
                <span className="text-sm text-gray-500">{song.duration}</span>
              </div>
              
              {/* Genre */}
              <div className="w-16 text-center">
                <span className="text-xs text-gray-400 truncate">{song.genre}</span>
              </div>
              
              {/* Playing Indicator */}
              {selectedSong?.id === song.id && isPlaying && (
                <div className="ml-2 flex items-center space-x-1">
                  <div className="w-1 h-3 bg-purple-500 rounded animate-pulse"></div>
                  <div className="w-1 h-2 bg-purple-400 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-4 bg-purple-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Music Player - Fixed at Bottom */}
        {selectedSong && selectedSong.url && (
          <div className="p-4 border-t border-gray-300 bg-gradient-to-b from-gray-50 to-gray-100">
            <audio ref={audioRef} src={selectedSong.url} onEnded={stopPlayback} style={{ display: 'none' }} />
            <div className="flex items-center space-x-4 mb-4">
              {/* Album Art */}
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md overflow-hidden bg-gray-200">
                <img
                  src={selectedSong ? artworkMap[selectedSong.title] || '' : ''}
                  alt={selectedSong ? selectedSong.title + ' artwork' : 'Album artwork'}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm truncate">{selectedSong.title}</h3>
                <p className="text-xs text-gray-600 truncate">{selectedSong.artist}</p>
                <p className="text-xs text-gray-500 truncate">{selectedSong.album} ({selectedSong.year})</p>
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={stopPlayback}
                  className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6h12v12H6z"/>
                  </svg>
                </button>
                <button
                  onClick={togglePlayPause}
                  className="w-10 h-10 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center text-white shadow-md transition-all transform hover:scale-105"
                >
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
              <div 
                className="bg-purple-500 h-1 rounded-full transition-all duration-100"
                style={{ width: `${isPlaying ? 45 : 0}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>{isPlaying ? '2:30' : '0:00'}</span>
              <span>{selectedSong.duration}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ITunesApp; 