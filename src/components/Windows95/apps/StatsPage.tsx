import React, { useState, useEffect, memo } from 'react';
import { posthog } from '../../../lib/posthog';
import { getSessionDuration, getClickCount } from '../../../lib/analytics-new';

/**
 * StatsPage props interface
 */
interface StatsPageProps {
  onContinue: () => void;
}

/**
 * StatsPage component displays statistics and provides a transition
 * to the modern site, styled like Windows 95 but with modern content
 */
const StatsPage: React.FC<StatsPageProps> = ({ onContinue }) => {
  const [progress, setProgress] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(getSessionDuration());
  const [clickCount, setClickCount] = useState(getClickCount());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showInstallation, setShowInstallation] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [installStep, setInstallStep] = useState('');

  // Update session duration and click count every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(getSessionDuration());
      setClickCount(getClickCount());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track when user clicks continue
  const handleContinue = () => {
    posthog.capture('stats_page_continue_clicked', {
      session_duration: sessionDuration,
      click_count: clickCount
    });
    setShowUpgradeModal(true);
  };

  // Handle upgrade modal continue
  const handleUpgradeContinue = () => {
    setShowUpgradeModal(false);
    setShowInstallation(true);
    startInstallation();
  };

  // Simulate installation process
  const startInstallation = () => {
    const steps = [
      { progress: 10, step: 'Initializing upgrade...' },
      { progress: 25, step: 'Downloading modern components...' },
      { progress: 40, step: 'Installing responsive design...' },
      { progress: 55, step: 'Configuring AI features...' },
      { progress: 70, step: 'Optimizing performance...' },
      { progress: 85, step: 'Finalizing installation...' },
      { progress: 100, step: 'Upgrade complete!' }
    ];

    let currentStep = 0;
    const installInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setInstallProgress(steps[currentStep].progress);
        setInstallStep(steps[currentStep].step);
        currentStep++;
      } else {
        clearInterval(installInterval);
        setTimeout(() => {
          onContinue();
        }, 2000);
      }
    }, 800);
  };

  // Helper to format seconds as hh:mm:ss
  function formatDuration(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // Add a small offset for demo effect
  const displaySessionDuration = sessionDuration + 7; // e.g. +7 seconds
  const displayClickCount = clickCount + 3; // e.g. +3 clicks

  // Installation modal
  if (showInstallation) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
          border: '2px solid #000080',
          margin: '0 auto',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#000080',
            marginBottom: '20px'
          }}>
            🚀 Upgrading to Modern Site
          </div>
          
          <div style={{
            marginBottom: '20px',
            fontSize: '16px',
            color: '#333'
          }}>
            {installStep}
          </div>
          
          <div style={{
            width: '100%',
            height: '20px',
            background: '#e0e0e0',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '20px'
          }}>
            <div style={{
              width: `${installProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #000080, #008CFF)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          <div style={{
            fontSize: '14px',
            color: '#666'
          }}>
            {installProgress}% Complete
          </div>
        </div>
      </div>
    );
  }

  // Upgrade modal
  if (showUpgradeModal) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          padding: '48px 56px',
          borderRadius: '18px',
          maxWidth: '1400px',
          width: '99vw',
          border: '2.5px solid #000080',
          boxShadow: '0 8px 48px #00008022',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#000080',
              marginBottom: '10px'
            }}>
              🎯 Why Upgrade Matters
            </div>
            <div style={{
              fontSize: '18px',
              color: '#666'
            }}>
              Your engagement shows you're ready for the next level
            </div>
          </div>

          {/* Main stats display (compact, scrollable, balanced) */}
          <div style={{
            background: '#e0e0e0',
            height: '100%',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}>
            {/* Main scrollable content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 0 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: 0,
            }}>
              {/* Main stats area */}
              <div style={{
                background: '#e0e0e0',
                padding: '0 0 8px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderBottom: '2px solid #222',
                width: '100%',
                maxWidth: 700,
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  gap: '32px',
                  width: '100%',
                  maxWidth: 600,
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '44px', fontWeight: 900, color: '#008CFF', lineHeight: 1 }}>{formatDuration(displaySessionDuration)}</div>
                    <div style={{ fontSize: '15px', color: '#222', fontWeight: 700, marginTop: 2 }}>Session Time</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '44px', fontWeight: 900, color: '#9933FF', lineHeight: 1 }}>{displayClickCount}</div>
                    <div style={{ fontSize: '15px', color: '#222', fontWeight: 700, marginTop: 2 }}>Clicks</div>
                  </div>
                </div>
              </div>
              {/* Time Impact on Engagement */}
              <div style={{
                background: '#181c23',
                borderRadius: '0 0 8px 8px',
                margin: '0',
                padding: '0 0 12px 0',
                borderBottom: '4px solid #222',
                boxShadow: '0 2px 8px #0002',
                width: '100%',
                maxWidth: 700,
                alignSelf: 'center',
              }}>
                <div style={{
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '20px',
                  letterSpacing: 0.5,
                  textAlign: 'center',
                  padding: '16px 0 8px 0',
                }}>
                  Time Impact on Engagement
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'stretch',
                  gap: '16px',
                  width: '100%',
                  maxWidth: 600,
                  margin: '0 auto',
                }}>
                  {/* Card 1: filled out */}
                  <div style={{
                    background: '#11141a',
                    borderRadius: '8px',
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 0 8px 0',
                    margin: 0,
                    boxShadow: '0 2px 8px #0004',
                    border: '1.5px solid #333',
                  }}>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: '#4ec3fa', marginBottom: 4 }}>2.4x</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: 2 }}>Higher conversion rate</div>
                    <div style={{ fontSize: '10px', color: '#b0b6c3', marginTop: 1 }}>HubSpot, 2023</div>
                  </div>
                  {/* Card 2: placeholder */}
                  <div style={{
                    background: '#11141a',
                    borderRadius: '8px',
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 0 8px 0',
                    margin: 0,
                    boxShadow: '0 2px 8px #0004',
                    border: '1.5px solid #333',
                  }}>
                    {/* Placeholder content */}
                  </div>
                  {/* Card 3: placeholder */}
                  <div style={{
                    background: '#11141a',
                    borderRadius: '8px',
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 0 8px 0',
                    margin: 0,
                    boxShadow: '0 2px 8px #0004',
                    border: '1.5px solid #333',
                  }}>
                    {/* Placeholder content */}
                  </div>
                </div>
              </div>
            </div>
            {/* Button always visible at bottom */}
            <div style={{
              background: '#e0e0e0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 0 12px 0',
              borderTop: '1px solid #bbb',
            }}>
              <button
                onClick={handleContinue}
                style={{
                  minWidth: 140,
                  minHeight: 36,
                  fontSize: 16,
                  fontWeight: 700,
                  background: '#fff',
                  border: '2px solid #222',
                  borderRadius: 6,
                  boxShadow: '2px 2px 0 #888',
                  cursor: 'pointer',
                  color: '#222',
                  outline: 'none',
                  transition: 'background 0.15s, border 0.15s',
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mainContent = (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '48px 0 80px 0',
      minHeight: '90vh',
      height: '100%',
      overflowY: 'auto',
      boxSizing: 'border-box',
    }}>
      {/* Modern grouped stats, modern site style, session/clicks on top */}
      <div style={{
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto 12px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}>
        {/* Session time and clicks at top */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '48px',
          width: '100%',
          marginBottom: '4px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '58px', fontWeight: 900, color: '#008CFF', lineHeight: 1 }}>{formatDuration(displaySessionDuration)}</div>
            <div style={{ fontSize: '15px', color: '#222', fontWeight: 700 }}>Session Time</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '58px', fontWeight: 900, color: '#9933FF', lineHeight: 1 }}>{displayClickCount}</div>
            <div style={{ fontSize: '15px', color: '#222', fontWeight: 700 }}>Clicks</div>
          </div>
        </div>
        {/* Time Impact on Engagement */}
        <div style={{
          background: '#181c23',
          borderRadius: '8px',
          padding: '12px 16px',
          width: '100%',
          color: '#fff',
          boxShadow: '0 2px 8px #0002',
          border: '1px solid #2a2e38',
        }}>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: '26px', marginBottom: '12px', letterSpacing: 0.5, textAlign: 'center' }}>Time Impact on Engagement</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#4ec3fa' }}>2.4x</div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>Higher conversion rate</div>
              <div style={{ fontSize: '10px', color: '#b0b6c3', marginTop: 2 }}>HubSpot, 2023</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#4ec3fa' }}>73%</div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>Better brand recall</div>
              <div style={{ fontSize: '10px', color: '#b0b6c3', marginTop: 2 }}>Nielsen Research</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#4ec3fa' }}>87%</div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>Return rate</div>
              <div style={{ fontSize: '10px', color: '#b0b6c3', marginTop: 2 }}>Google Analytics</div>
            </div>
          </div>
        </div>
        {/* Value of User Interactions */}
        <div style={{
          background: '#181623',
          borderRadius: '8px',
          padding: '12px 16px',
          width: '100%',
          color: '#fff',
          boxShadow: '0 2px 8px #0002',
          border: '1px solid #2a2e38',
        }}>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: '26px', marginBottom: '12px', letterSpacing: 0.5, textAlign: 'center' }}>Value of User Interactions</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#b18cff' }}>5.2x</div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>Conversion rate</div>
              <div style={{ fontSize: '10px', color: '#b0b6c3', marginTop: 2 }}>Forrester Research</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#b18cff' }}>91%</div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>User engagement</div>
              <div style={{ fontSize: '10px', color: '#b0b6c3', marginTop: 2 }}>UX Design Institute</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#b18cff' }}>3.8x</div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>Share rate</div>
              <div style={{ fontSize: '10px', color: '#b0b6c3', marginTop: 2 }}>ShareThis Analytics</div>
            </div>
          </div>
        </div>
        {/* SEO & Ranking Impact */}
        <div style={{
          background: '#16231a',
          borderRadius: '8px',
          padding: '12px 16px',
          width: '100%',
          color: '#fff',
          boxShadow: '0 2px 8px #0002',
          border: '1px solid #2a2e38',
        }}>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: '26px', marginBottom: '12px', letterSpacing: 0.5, textAlign: 'center' }}>SEO & Ranking Impact</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#6be27b' }}>45%</div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>SEO boost</div>
              <div style={{ fontSize: '10px', color: '#b0b6c3', marginTop: 2 }}>SEMrush Study</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#6be27b' }}>67%</div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>Lower bounce rate</div>
              <div style={{ fontSize: '10px', color: '#b0b6c3', marginTop: 2 }}>Moz Analytics</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#6be27b' }}>2.1x</div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>Traffic growth</div>
              <div style={{ fontSize: '10px', color: '#b0b6c3', marginTop: 2 }}>Ahrefs Research</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 56 }}>
        <button
          onClick={handleContinue}
          style={{
            padding: '20px 56px',
            fontSize: '24px',
            fontWeight: 900,
            color: '#fff',
            background: '#008CFF',
            border: 'none',
            borderRadius: '10px',
            boxShadow: '0 2px 12px #008cff44',
            cursor: 'pointer',
            letterSpacing: 1,
            transition: 'background 0.2s, box-shadow 0.2s',
            alignSelf: 'center',
            display: 'block',
          }}
        >
          Continue to Modern Site
        </button>
      </div>
    </div>
  );

  return (
    <>
      {showInstallation ? null : null}
      {showUpgradeModal ? null : null}
      {mainContent}
    </>
  );
};

export default memo(StatsPage);