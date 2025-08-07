import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import TestimonialsHeader from './TestimonialsHeader';

interface TestimonialsAppProps {
  onClose: () => void;
}

interface Testimonial {
  id: number;
  title: string;
  duration: string;
  url: string;
  client: string;
}

const TestimonialsApp: React.FC<TestimonialsAppProps> = ({ onClose }) => {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const testimonials: Testimonial[] = [
    { id: 1, title: 'Amazing Website Transformation', duration: '2:34', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/5.mp3', client: 'Sarah M.' },
    { id: 2, title: 'Professional Service Excellence', duration: '1:45', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/2.mp3', client: 'Michael R.' },
    { id: 3, title: 'Outstanding Digital Results', duration: '3:12', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/8.mp3', client: 'Jennifer L.' },
    { id: 4, title: 'Exceeded All Expectations', duration: '2:18', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/16.mp3', client: 'David K.' },
    { id: 5, title: 'Incredible Brand Makeover', duration: '1:56', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/15.mp3', client: 'Lisa T.' },
    { id: 6, title: 'Fast and Effective Solutions', duration: '2:45', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/4.mp3', client: 'Robert W.' },
    { id: 7, title: 'Creative Design Mastery', duration: '2:03', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/9.mp3', client: 'Amanda S.' },
    { id: 8, title: 'Remarkable Growth Impact', duration: '1:38', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/13.mp3', client: 'James H.' },
    { id: 9, title: 'Professional Excellence', duration: '2:22', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/12.mp3', client: 'Maria G.' },
    { id: 10, title: 'Transformative Results', duration: '1:51', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/11.mp3', client: 'Chris P.' },
    { id: 11, title: 'Exceptional Customer Service', duration: '2:15', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/7.mp3', client: 'Nicole B.' },
    { id: 12, title: 'Innovative Solutions Delivered', duration: '1:47', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/14.mp3', client: 'Kevin M.' },
    { id: 13, title: 'Outstanding Communication', duration: '2:08', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/17.mp3', client: 'Rachel D.' },
    { id: 14, title: 'Perfect Project Management', duration: '1:52', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/3.mp3', client: 'Andrew F.' },
    { id: 15, title: 'Incredible ROI Achievement', duration: '2:28', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/19.mp3', client: 'Taylor J.' },
    { id: 16, title: 'Strategic Vision Realized', duration: '2:01', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/6.mp3', client: 'Brandon C.' },
    { id: 17, title: 'Digital Transformation Success', duration: '1:43', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/1.mp3', client: 'Stephanie A.' },
    { id: 18, title: 'Remarkable Team Collaboration', duration: '2:12', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/18.mp3', client: 'Daniel V.' },
    { id: 19, title: 'Beyond Expectations Delivery', duration: '1:59', url: 'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/10.mp3', client: 'Emma K.' }
  ];

  const playTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = testimonial.url;
      audioRef.current.play();
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      <TestimonialsHeader onClose={onClose} />
      
      {/* Testimonials List - Scrollable */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="py-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ backgroundColor: '#f8f9fa' }}
              onClick={() => playTestimonial(testimonial)}
              className="flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {/* Voice Recording Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-md">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm5.3 6.7c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4-1.2 1.2-2.76 1.85-4.4 1.85s-3.2-.65-4.4-1.85c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0 .79.79 1.86 1.25 3 1.25s2.21-.46 3-1.25zM19 10v2c0 3.87-3.13 7-7 7s-7-3.13-7-7v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 2.76 2.24 5 5 5s5-2.24 5-5v-2c0-.55.45-1 1-1s1 .45 1 1z"/>
                    <path d="M12 19v2c0 .55-.45 1-1 1s-1-.45-1-1v-2h2z"/>
                  </svg>
                </div>
                
                {/* Testimonial Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{testimonial.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{testimonial.client}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-gray-400">Duration: {testimonial.duration}</span>
                    {selectedTestimonial?.id === testimonial.id && isPlaying && (
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-3 bg-red-500 rounded animate-pulse"></div>
                        <div className="w-1 h-2 bg-red-400 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-4 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-xs text-red-500 font-medium">Playing</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Play Button */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Audio Player - Fixed at Bottom */}
      {selectedTestimonial && (
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm5.3 6.7c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4-1.2 1.2-2.76 1.85-4.4 1.85s-3.2-.65-4.4-1.85c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0 .79.79 1.86 1.25 3 1.25s2.21-.46 3-1.25z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-xs">{selectedTestimonial.title}</h3>
                <p className="text-xs text-gray-500">{selectedTestimonial.client}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-100"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mb-3">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center space-x-3">
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
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all transform hover:scale-105"
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
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        style={{ display: 'none' }}
      />
    </motion.div>
  );
};

export default TestimonialsApp; 