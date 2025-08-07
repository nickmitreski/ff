import React from 'react';

interface NotesHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
}

const NotesHeader: React.FC<NotesHeaderProps> = ({ showBack = false, onBack }) => (
  <div className="notes-header skeuo-notes-header relative h-14 flex items-center justify-center">
    {showBack && (
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded skeuo-notes-back-btn text-white text-lg font-bold shadow"
        onClick={onBack}
        aria-label="Back to Notes"
      >
        &#x2039;
      </button>
    )}
    <span className="notes-header-title">{showBack ? 'Note' : 'Notes'}</span>
  </div>
);

export default NotesHeader; 