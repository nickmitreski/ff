import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface AppIconProps {
  id: string;
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
  isSelected: boolean;
  imageIcon?: string; // Path to image file
}

const AppIcon: React.FC<AppIconProps> = ({ 
  icon, 
  label, 
  color, 
  onPress, 
  isSelected,
  imageIcon
}) => {
  const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onPress}
      className="flex flex-col items-center space-y-1 relative"
      animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
    >
      {/* App Icon */}
      {imageIcon ? (
        // Image-based icon (no background)
        <div className={`relative w-16 h-16 flex items-center justify-center ${label === 'Games' ? 'bg-gray-700 border-4 border-white' : ''}`} style={label === 'Games' ? { boxShadow: 'none', background: 'none' } : {}}>
          <img 
            src={imageIcon} 
            alt={label}
            className="w-16 h-16 relative z-10 object-contain rounded-2xl"
          />
          {/* Selected Ring */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 rounded-2xl ring-2 ring-white/60 ring-offset-2 ring-offset-transparent"
            />
          )}
        </div>
      ) : (
        // Colored background icon (for apps without images)
        <div className={`
          relative w-16 h-16 ${color} rounded-2xl shadow-lg
          flex items-center justify-center
          border border-white/20
          bg-gradient-to-br from-white/20 to-transparent
          overflow-hidden
        `}>
          {/* Glossy Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-white/20 to-transparent opacity-70"></div>
          
          {/* Icon */}
          <IconComponent className="w-8 h-8 text-white relative z-10" />
          
          {/* Selected Ring */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 rounded-2xl ring-2 ring-white/60 ring-offset-2 ring-offset-transparent"
            />
          )}
        </div>
      )}
      
      {/* App Label */}
      <span className="text-white text-[10px] font-medium max-w-16 truncate leading-tight">
        {label}
      </span>
    </motion.button>
  );
};

export default AppIcon;