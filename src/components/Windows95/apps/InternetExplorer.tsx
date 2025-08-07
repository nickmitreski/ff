import React from 'react';

/**
 * InternetExplorer component simulates the Internet Explorer browser
 * in the Windows 95 interface
 */
const InternetExplorer: React.FC = () => {
  return (
    <div style={{ padding: '5px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        backgroundColor: 'var(--win95-window-bg)', 
        padding: '5px',
        marginBottom: '5px',
        border: '1px solid var(--win95-border-inner-dark)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{ marginRight: '5px' }}>Address:</span>
        <div style={{ 
          flex: 1,
          backgroundColor: 'white',
          border: '1px solid var(--win95-border-outer-dark)',
          boxShadow: '1px 1px 0 0 var(--win95-border-inner-light) inset',
          padding: '2px 5px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#222'
        }}>
          http://yahoo.com
        </div>
        <button className="win95-button" style={{ marginLeft: '5px' }}>Go</button>
      </div>
      <div style={{
        flex: 1,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff'
      }}>
        <img src="/yahoo.png" alt="Yahoo 90s" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    </div>
  );
};

export default InternetExplorer;