import React, { memo } from 'react';
import { AppContentProps } from '../../../data/appData.tsx';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface ComingSoonProps extends AppContentProps {
  featureName?: string;
}

/**
 * ComingSoon component displays a placeholder for features that are not yet implemented
 * @param props - Standard AppContentProps
 */
const ComingSoon: React.FC<ComingSoonProps> = ({ featureName = 'this feature' }) => {
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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100%', 
      height: '100%', 
      fontSize: '24px', 
      color: '#fff', 
      backgroundColor: '#000' 
    }}>
      <div>Coming Soon!</div>
      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16 }}>
          <label htmlFor="coming-soon-email" style={{ marginBottom: 8, color: '#fff', fontSize: 16 }}>Get notified when {featureName} is available:</label>
          <input
            id="coming-soon-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', fontSize: 16, marginBottom: 8 }}
            required
            disabled={loading}
          />
          <button 
            type="submit" 
            className="win95-button" 
            style={{ 
              fontSize: 16, 
              padding: '6px 18px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Notify Me'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 8, fontSize: 14 }}>{error}</div>}
        </form>
      ) : (
        <div style={{ marginTop: 24, color: '#0f0', fontSize: 18 }}>Thank you! You'll be notified when {featureName} is ready.</div>
      )}
    </div>
  );
};

export default memo(ComingSoon);