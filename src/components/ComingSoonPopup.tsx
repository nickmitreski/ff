import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ComingSoonPopupProps {
  featureName?: string;
}

const ComingSoonPopup: React.FC<ComingSoonPopupProps> = ({ featureName = 'this feature' }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const { error: supabaseError } = await supabase
        .from('coming_soon_notifications')
        .insert([
          {
            email: email,
            feature_name: featureName
          }
        ]);

      if (supabaseError) {
        throw supabaseError;
      }

      setSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error submitting email:', err);
      setError('Failed to submit email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        background: '#fff',
        color: '#222',
        fontSize: 18,
        fontFamily: 'MS Sans Serif, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '0 0 24px 0',
      }}
    >
      {/* Title Bar */}
      <div
        style={{
          background: 'linear-gradient(to bottom, #000080 80%, #3a6ea5 100%)',
          color: 'white',
          width: '100%',
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 20,
          borderBottom: '2px solid #808080',
          letterSpacing: 1,
          boxSizing: 'border-box',
        }}
      >
        Coming Soon
      </div>
      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: 17, marginBottom: 16, width: '100%' }}>
          {featureName} is not available yet.<br />
          Enter your email below and you'll be notified as soon as it's released!
        </div>
        <div style={{
          background: '#f4f4f4',
          border: '1.5px solid #b0b0b0',
          borderRadius: 4,
          padding: '18px 18px 10px 18px',
          minWidth: 260,
          maxWidth: 320,
          margin: '0 auto',
          boxShadow: '0 2px 8px #00000011',
        }}>
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ fontSize: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <label htmlFor="coming-soon-email" style={{ marginBottom: 8, color: '#222', fontSize: 15, fontWeight: 500 }}>Get notified:</label>
              <input
                id="coming-soon-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ padding: '8px 14px', borderRadius: 4, border: '1.5px solid #808080', fontSize: 15, marginBottom: 12, width: 200 }}
                required
                disabled={loading}
              />
              <button 
                type="submit" 
                className="win95-button" 
                style={{ 
                  fontSize: 15, 
                  padding: '7px 22px', 
                  background: '#e0e0e0', 
                  border: '2px outset #fff', 
                  color: '#000', 
                  fontWeight: 600, 
                  borderRadius: 4, 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Notify Me'}
              </button>
              {error && <div style={{ color: 'red', marginTop: 8, fontSize: 13 }}>{error}</div>}
            </form>
          ) : (
            <div style={{ marginTop: 4, color: '#008000', fontSize: 16, fontWeight: 500, textAlign: 'center' }}>
              Thank you! You'll be notified when {featureName} is available.<br />
              <span style={{ fontSize: 14, color: '#222', display: 'block', marginTop: 8 }}>Stay tuned for updates in your inbox.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPopup; 