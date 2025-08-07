import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = 'white',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-1 h-1',
    medium: 'w-2 h-2',
    large: 'w-3 h-3'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex space-x-1">
        <div 
          className={`${sizeClasses[size]} rounded-full animate-bounce`}
          style={{ backgroundColor: color }}
        ></div>
        <div 
          className={`${sizeClasses[size]} rounded-full animate-bounce`}
          style={{ 
            backgroundColor: color,
            animationDelay: '0.1s' 
          }}
        ></div>
        <div 
          className={`${sizeClasses[size]} rounded-full animate-bounce`}
          style={{ 
            backgroundColor: color,
            animationDelay: '0.2s' 
          }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 