import React from 'react';

interface PhotosHeaderProps {
  title?: string;
}

const PhotosHeader: React.FC<PhotosHeaderProps> = ({ title = 'Photos' }) => (
  <div className="iphone-header relative h-12 flex items-center justify-center bg-gradient-to-b from-[#6d83a1] to-[#b4bfce] border-b border-blue-700 shadow-inner">
    <span className="contact_name button text-white font-bold text-base tracking-tight drop-shadow-sm">{title}</span>
  </div>
);

export default PhotosHeader; 