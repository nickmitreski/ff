import React from 'react';

interface MobileRestrictionPopupProps {
  onClose: () => void;
}

const MobileRestrictionPopup: React.FC<MobileRestrictionPopupProps> = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: '#c0c0c0',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080',
        padding: '20px',
        maxWidth: '300px',
        textAlign: 'center',
        fontFamily: 'MS Sans Serif, Arial, sans-serif'
      }}>
        <div style={{
          backgroundColor: '#000080',
          color: 'white',
          padding: '8px',
          margin: '-20px -20px 15px -20px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Desktop Only
        </div>
        
        <div style={{
          fontSize: '12px',
          marginBottom: '20px',
          lineHeight: '1.4'
        }}>
          This game is available only on desktop website view.
          <br />
          Please visit on a desktop computer for the full experience.
        </div>
        
        <button 
          onClick={onClose}
          style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080',
            padding: '6px 12px',
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
            fontSize: '12px',
            cursor: 'pointer',
            minWidth: '80px'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.borderColor = '#808080 #ffffff #ffffff #808080';
            e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #808080, inset -1px -1px 0 #dfdfdf';
            e.currentTarget.style.paddingTop = '7px';
            e.currentTarget.style.paddingLeft = '13px';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
            e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080';
            e.currentTarget.style.paddingTop = '6px';
            e.currentTarget.style.paddingLeft = '12px';
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default MobileRestrictionPopup; 