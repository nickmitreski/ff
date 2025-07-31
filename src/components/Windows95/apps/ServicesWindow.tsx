import React, { useState } from 'react';
// Import modern service popups
import WebDesignPopup from '../../modern-site/service-popups/WebDesignPopup';
import BrandingPopup from '../../modern-site/service-popups/BrandingPopup';
import ContentCreationPopup from '../../modern-site/service-popups/ContentCreationPopup';
import AIAutomationPopup from '../../modern-site/service-popups/AIAutomationPopup';
import SocialMediaPopup from '../../modern-site/service-popups/SocialMediaPopup';
import SEOPopup from '../../modern-site/service-popups/SEOPopup';

const services = [
  {
    id: 'web-design',
    title: 'Web Design & Development',
    icon: '/documents copy.png',
    description: 'Custom websites that look great and perform even better.',
    color: '#008CFF'
  },
  {
    id: 'branding',
    title: 'Branding & Identity',
    icon: '/BRANDING.webp',
    description: 'Create a memorable brand that stands out in the digital landscape.',
    color: '#FFCC00'
  },
  {
    id: 'content',
    title: 'Content Creation',
    icon: '/VIDEOS.webp',
    description: 'Engaging content that tells your story and captures attention.',
    color: '#FF1493'
  },
  {
    id: 'ai',
    title: 'AI & Automation',
    icon: '/AI.png',
    description: 'Leverage AI to automate and enhance your business processes.',
    color: '#00CC66'
  },
  {
    id: 'social',
    title: 'Social Media',
    icon: '/VIDEOS.webp',
    description: 'Build your presence on social media with engaging content.',
    color: '#9933FF'
  },
  {
    id: 'seo',
    title: 'SEO',
    icon: '/SEO.png',
    description: 'Boost your online visibility and rankings with expert SEO services.',
    color: '#FF6600'
  },
];

const popupComponents: Record<string, React.FC<{ onClose: () => void }>> = {
  'web-design': WebDesignPopup,
  'branding': BrandingPopup,
  'content': ContentCreationPopup,
  'ai': AIAutomationPopup,
  'social': SocialMediaPopup,
  'seo': SEOPopup,
};

const ServicesWindow: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const handleOpenPopup = (id: string) => setSelectedServiceId(id);
  const handleClosePopup = () => setSelectedServiceId(null);

  const PopupComponent = selectedServiceId ? popupComponents[selectedServiceId] : null;

  return (
    <div className="win95-services" style={{ 
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
        <img src="/flashforward.png" alt="Flash Forward" style={{ width: '40px', height: '40px' }} />
        <div>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: 0,
            color: '#000080'
          }}>
            Our Services
          </h2>
          <p style={{
            fontSize: '12px',
            margin: '4px 0 0 0',
            color: '#666666'
          }}>
            Transform your business with our comprehensive digital solutions
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        padding: '4px'
      }}>
        {services.map((service) => (
          <div key={service.id} style={{
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            background: 'white',
            boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.borderColor = '#808080 #ffffff #ffffff #808080';
            e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #808080, inset -1px -1px 0 #dfdfdf';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
            e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
            e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080';
          }}>
            
            {/* Top Accent */}
            <div style={{
              height: '4px',
              background: service.color,
              width: '100%'
            }} />
            
            {/* Service Content */}
            <div style={{ padding: '16px' }}>
              {/* Icon and Title */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: `${service.color}15`,
                  border: `2px solid ${service.color}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <img 
                    src={service.icon} 
                    alt={service.title} 
                    style={{ width: '24px', height: '24px' }} 
                  />
                </div>
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  margin: 0,
                  color: '#000080',
                  flex: 1,
                  lineHeight: '1.2'
                }}>
                  {service.title}
                </h3>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '12px',
                lineHeight: '1.4',
                margin: '0 0 16px 0',
                color: '#333333'
              }}>
                {service.description}
              </p>

              {/* Action Button */}
              <button 
                onClick={() => handleOpenPopup(service.id)}
                style={{
                  background: service.color,
                  border: '2px solid',
                  borderColor: '#ffffff #808080 #808080 #ffffff',
                  boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080',
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  color: 'white',
                  width: '100%',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.borderColor = '#808080 #ffffff #ffffff #808080';
                  e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #808080, inset -1px -1px 0 #dfdfdf';
                  e.currentTarget.style.padding = '9px 15px 7px 17px';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
                  e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080';
                  e.currentTarget.style.padding = '8px 16px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
                  e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080';
                  e.currentTarget.style.padding = '8px 16px';
                }}>
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        border: '2px solid',
        borderColor: '#808080 #ffffff #ffffff #808080',
        background: '#c0c0c0',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '12px',
          margin: 0,
          color: '#000000',
          fontWeight: 'bold'
        }}>
          Ready to transform your business? Let's discuss your project!
        </p>
      </div>

      {/* Modern Popup Overlay */}
      {PopupComponent && (
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
            <PopupComponent onClose={handleClosePopup} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesWindow;