import React, { memo } from 'react';

interface IconProps {
  name: string;
  icon: string;
  x: number;
  y: number;
  onOpen: (name: string) => void;
  singleClick?: boolean;
}

const Icon: React.FC<IconProps> = ({ name, icon, x, y, onOpen, singleClick }) => {
  const handleOpen = () => {
    console.log(`[WINAMP DEBUG] Icon clicked:`, { name, icon, x, y });
    onOpen(name);
  };
  return (
    <div 
      className="win95-desktop-icon" 
      style={{ left: `${x}px`, top: `${y}px` }}
      {...(singleClick ? { onClick: handleOpen } : { onDoubleClick: handleOpen })}
    >
      <img src={icon} alt={name} className="win95-desktop-icon-img" />
      <div className="win95-desktop-icon-text">{name}</div>
    </div>
  );
};

export default memo(Icon);