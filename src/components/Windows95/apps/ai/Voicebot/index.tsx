import React, { useState } from 'react';
import { supabase } from '../../../../../lib/supabase';

const Voicebot: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const { error: submitError } = await supabase
        .from('coming_soon_notifications')
        .insert([
          {
            email: email,
            feature_name: 'Voice Assistant'
          }
        ]);

      if (submitError) {
        console.error('Error submitting email:', submitError);
        setError('Failed to submit email. Please try again.');
      } else {
        setSubmitted(true);
        setEmail('');
      }
    } catch (err) {
      console.error('Error submitting email:', err);
      setError('Failed to submit email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#c0c0c0',
      overflow: 'auto'
    }}>
      <div style={{ 
        backgroundColor: '#000080',
        padding: '5px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <img 
          src="/callagent.png" 
          alt="Voice Assistant" 
          style={{ width: '24px', height: '24px', marginRight: '10px' }} 
        />
        <h2 style={{ fontSize: '16px', margin: 0 }}>Voice Assistant - Coming Soon</h2>
      </div>
      
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div 
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#808080',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '3px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}
        >
          <img 
            src="/callagent.png" 
            alt="Voice Assistant" 
            style={{ 
              width: '60px', 
              height: '60px',
              filter: 'brightness(0.8)'
            }} 
          />
        </div>
        
        <div style={{ textAlign: 'center', maxWidth: '300px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Voice Assistant</h3>
          <p style={{ fontSize: '14px', marginBottom: '20px', lineHeight: '1.4' }}>
            Our AI voice assistant will be available soon! Get notified when it's ready to help you with voice commands and interactions.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '300px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Email Address:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '2px solid',
                  borderColor: '#808080 #ffffff #ffffff #808080',
                  backgroundColor: 'white',
                  fontSize: '14px'
                }}
                required
              />
            </div>
            
            <button 
              type="submit"
              className="win95-button"
              style={{ 
                width: '100%',
                padding: '10px 20px', 
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Notify Me When Available'}
            </button>
            
            {error && (
              <div style={{
                marginTop: '10px',
                padding: '8px',
                backgroundColor: '#ffeeee',
                border: '1px solid red',
                color: 'red',
                fontSize: '12px'
              }}>
                {error}
              </div>
            )}
          </form>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#e8f5e8',
            border: '2px solid',
            borderColor: '#808080 #ffffff #ffffff #808080',
            maxWidth: '300px'
          }}>
            <h4 style={{ fontSize: '14px', marginBottom: '5px', color: 'green' }}>Thank You!</h4>
            <p style={{ fontSize: '12px', margin: 0 }}>
              We'll notify you when the Voice Assistant is available.
            </p>
            <button 
              className="win95-button"
              style={{ 
                marginTop: '10px',
                padding: '5px 15px', 
                fontSize: '12px' 
              }}
              onClick={() => setSubmitted(false)}
            >
              Submit Another Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Voicebot;