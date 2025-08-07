import React from 'react';

const Modal95: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.35)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      background: '#fff',
      border: '2.5px solid #808080',
      borderRadius: 6,
      boxShadow: '4px 8px 32px #00000055',
      width: 560,
      minHeight: 400,
      maxWidth: '98vw',
      maxHeight: '98vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: 0,
    }}>
      {children}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 24,
          height: 24,
          background: '#c0c0c0',
          border: '2px outset #fff',
          borderRadius: 2,
          color: '#000',
          fontWeight: 'bold',
          fontSize: 16,
          cursor: 'pointer',
          lineHeight: 1,
        }}
        aria-label="Close"
      >×</button>
    </div>
  </div>
);

export default Modal95; 