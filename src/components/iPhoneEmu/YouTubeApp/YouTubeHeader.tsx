import React from 'react';

// Remove onClose prop since it's no longer needed
const YouTubeHeader: React.FC = () => (
  <div className="relative h-12 flex items-center justify-center bg-gradient-to-b from-[#6d83a1] to-[#b4bfce] border-b border-blue-700 shadow-inner">
    <span className="contact_name button text-white font-bold text-base tracking-tight drop-shadow-sm">YouTube</span>
  </div>
);

export default YouTubeHeader; 