import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NotesHeader from './NotesHeader';
import './NotesApp.css';

interface NotesAppProps {
  onClose: () => void;
}

const NotesApp: React.FC<NotesAppProps> = ({ onClose }) => {
  const [note, setNote] = useState('');

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="notes-app skeuo-notes-bg"
    >
      <NotesHeader />
      <div className="notes-content skeuo-notes-paper">
        <textarea
          className="notes-textarea notes-text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder=""
          autoFocus
        />
      </div>
      {/* Bottom Toolbar */}
      <div className="skeuo-notes-toolbar">
        <button className="notes-toolbar-btn" aria-label="Share">
          &#x21AA;
        </button>
        <button className="notes-toolbar-btn" aria-label="Delete">
          &#x1F5D1;
        </button>
        <button className="notes-toolbar-btn" aria-label="New Note">
          +
        </button>
      </div>
    </motion.div>
  );
};

export default NotesApp; 