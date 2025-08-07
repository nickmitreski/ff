import React from 'react';

interface ModernSiteHeaderProps {
  onClose: () => void;
}

const ModernSiteHeader: React.FC<ModernSiteHeaderProps> = ({ onClose }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">FF</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-800">Flash Forward</div>
          <div className="text-xs text-gray-500">Site Performance Analytics</div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors"
      >
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default ModernSiteHeader; 