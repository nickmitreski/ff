import React, { useState } from 'react';
// Import modern work popups
import WebDesignWorkPopup from '../../modern-site/work-popups/WebDesignWorkPopup';
import VideosWorkPopup from '../../modern-site/work-popups/VideosWorkPopup';
import BrandingWorkPopup from '../../modern-site/work-popups/BrandingWorkPopup';
import DesignWorkPopup from '../../modern-site/work-popups/DesignWorkPopup';
import AIWorkPopup from '../../modern-site/work-popups/AIWorkPopup';
import GrowthWorkPopup from '../../modern-site/work-popups/GrowthWorkPopup';

/**
 * OurWorkWindow component displays work categories as folders in the Windows 95 interface
 * and opens modern site popups when folders are clicked
 */
const OurWorkWindow: React.FC = () => {
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);

  // Work categories matching the modern site
  const workCategories = [
    { 
      id: 'websites', 
      title: 'Websites', 
      icon: '/WEBSITES.png',
      color: '#008CFF',
      description: 'Custom websites and web applications'
    },
    { 
      id: 'videos', 
      title: 'Videos', 
      icon: '/VIDEOS.png',
      color: '#FF1493',
      description: 'Video production and content creation'
    },
    { 
      id: 'branding', 
      title: 'Branding', 
      icon: '/BRANDING.png',
      color: '#FFCC00',
      description: 'Brand identity and visual design'
    },
    { 
      id: 'design', 
      title: 'Design', 
      icon: '/DESIGN.png',
      color: '#9933FF',
      description: 'UI/UX design and creative solutions'
    },
    { 
      id: 'ai', 
      title: 'AI', 
      icon: '/AI.png',
      color: '#00CC66',
      description: 'AI automation and intelligent solutions'
    },
    { 
      id: 'seo', 
      title: 'SEO', 
      icon: '/SEO.png',
      color: '#FF6600',
      description: 'Search engine optimization and growth'
    }
  ];

  const handleOpenWork = (workId: string) => {
    setSelectedWorkId(workId);
  };

  const handleCloseWork = () => {
    setSelectedWorkId(null);
  };

  // Render the appropriate popup based on the selected work
  const renderWorkPopup = () => {
    switch (selectedWorkId) {
      case 'websites':
        return <WebDesignWorkPopup onClose={handleCloseWork} />;
      case 'videos':
        return <VideosWorkPopup onClose={handleCloseWork} />;
      case 'branding':
        return <BrandingWorkPopup onClose={handleCloseWork} />;
      case 'design':
        return <DesignWorkPopup onClose={handleCloseWork} />;
      case 'ai':
        return <AIWorkPopup onClose={handleCloseWork} />;
      case 'seo':
        return <GrowthWorkPopup onClose={handleCloseWork} />;
      default:
        return null;
    }
  };

  return (
    <div className="win95-work" style={{ 
      padding: '16px', 
      height: '100%', 
      overflowY: 'auto',
      background: '#c0c0c0',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
        padding: '16px',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        background: 'white',
        boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080'
      }}>
        <img src="/Our_Work.png" alt="Our Work" style={{ width: '40px', height: '40px' }} />
        <div>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: '0 0 4px 0',
            color: '#000080'
          }}>
            Our Work Portfolio
          </h2>
          <p style={{ 
            fontSize: '12px', 
            margin: '0',
            color: '#666'
          }}>
            Click on a folder to view our work in that category
          </p>
        </div>
      </div>

      {/* Work Categories as Folders */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '16px',
        padding: '4px'
      }}>
        {workCategories.map((category) => (
          <div
            key={category.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '8px',
              border: '2px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              background: 'white',
              boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080',
              transition: 'all 0.15s ease',
              minHeight: '100px'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.borderColor = '#808080 #ffffff #ffffff #808080';
              e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #808080, inset -1px -1px 0 #dfdfdf';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
              e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080';
              handleOpenWork(category.id);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
              e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080';
            }}
          >
            {/* Folder Icon */}
            <div style={{
              width: '48px',
              height: '48px',
              marginBottom: '8px',
              position: 'relative'
            }}>
              {/* Folder Background */}
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: category.color,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid',
                borderColor: '#ffffff #808080 #808080 #ffffff',
                boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080'
              }}>
                <img 
                  src={category.icon} 
                  alt={category.title} 
                  style={{ 
                    width: '32px', 
                    height: '32px',
                    filter: 'brightness(0) invert(1)' // Make icon white
                  }} 
                />
              </div>
            </div>

                         {/* Folder Name */}
             <div style={{
               textAlign: 'center',
               fontSize: '14px',
               fontWeight: 'bold',
               color: '#000080',
               lineHeight: '1.2',
               wordBreak: 'break-word'
             }}>
               {category.title}
             </div>

            
          </div>
        ))}
      </div>



      {/* Modern Popup Overlay */}
      {selectedWorkId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', 
            maxWidth: '90vw', 
            maxHeight: '90vh', 
            overflow: 'auto',
            position: 'relative'
          }}>
            {renderWorkPopup()}
          </div>
        </div>
      )}
    </div>
  );
};

export default OurWorkWindow;