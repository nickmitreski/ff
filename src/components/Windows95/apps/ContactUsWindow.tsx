import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { posthog } from '../../../lib/posthog';

/**
 * ContactUsWindow component provides a contact form in the Windows 95 interface
 * with styling inspired by the modern site
 */
const ContactUsWindow: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handles form submission
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Track form submission with PostHog
      posthog.capture('win95_contact_form_submitted', {
        name_provided: !!formData.name.trim(),
        email_provided: !!formData.email.trim(),
        message_length: formData.message.length
      });

      const { error } = await supabase().from('contact_submissions').insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          timestamp: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Track successful submission
      posthog.capture('win95_contact_form_success');
    } catch (err) {
      setStatus('error');
      setErrorMessage('Failed to submit form. Please try again.');
      console.error('Error submitting form:', err);
      
      // Track error
      posthog.capture('win95_contact_form_error', {
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  /**
   * Handles input field changes
   * @param e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="win95-contact">
      <div className="win95-contact-header">
        <img src="/phone.png" alt="Contact" className="win95-contact-logo" />
        <h2 className="win95-contact-title">Contact Us</h2>
      </div>

      <div className="win95-contact-intro">
        <p>Have a question or want to discuss a project? Fill out the form below and we'll get back to you as soon as possible.</p>
      </div>

      {status === 'success' ? (
        <div className="win95-contact-success">
          <div className="win95-contact-success-icon">✓</div>
          <h3>Message Sent!</h3>
          <p>Thank you for your message! We'll get back to you as soon as possible.</p>
          <button 
            className="win95-button"
            onClick={() => setStatus('idle')}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="win95-contact-form">
          <div className="win95-contact-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="win95-contact-input"
            />
          </div>

          <div className="win95-contact-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="win95-contact-input"
            />
          </div>

          <div className="win95-contact-field">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="win95-contact-textarea"
              rows={6}
            />
          </div>

          {status === 'error' && (
            <div className="win95-contact-error">
              {errorMessage}
            </div>
          )}

          <div className="win95-contact-actions">
            <button 
              type="submit" 
              className="win95-button"
              disabled={status === 'submitting'}
              onClick={() => posthog.capture('win95_contact_form_submit_clicked')}
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      )}



      <style>{`
        .win95-contact {
          padding: 10px;
          height: 100%;
          overflow-y: auto;
          background: var(--win95-window-bg);
        }
        
        .win95-contact-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
          padding: 5px;
          border: 1px solid var(--win95-border-inner-dark);
          background: white;
        }
        
        .win95-contact-logo {
          width: 32px;
          height: 32px;
        }
        
        .win95-contact-title {
          font-size: 14px;
          font-weight: bold;
          margin: 0;
        }
        
        .win95-contact-intro {
          margin-bottom: 15px;
          padding: 10px;
          border: 2px solid;
          border-color: var(--win95-border-outer-light) var(--win95-border-outer-dark) var(--win95-border-outer-dark) var(--win95-border-outer-light);
          background: white;
        }
        
        .win95-contact-intro p {
          margin: 0;
          font-size: 12px;
        }
        
        .win95-contact-form {
          background: white;
          padding: 10px;
          border: 2px solid;
          border-color: var(--win95-border-outer-light) var(--win95-border-outer-dark) var(--win95-border-outer-dark) var(--win95-border-outer-light);
          margin-bottom: 15px;
        }
        
        .win95-contact-field {
          margin-bottom: 10px;
        }
        
        .win95-contact-field label {
          display: block;
          font-size: 12px;
          margin-bottom: 4px;
        }
        
        .win95-contact-input,
        .win95-contact-textarea {
          width: 100%;
          padding: 4px;
          font-size: 12px;
          font-family: 'MS Sans Serif', Arial, sans-serif;
          border: 2px solid;
          border-color: var(--win95-border-outer-dark) var(--win95-border-outer-light) var(--win95-border-outer-light) var(--win95-border-outer-dark);
          background: white;
          box-shadow: 1px 1px 0 0 var(--win95-border-inner-light) inset;
        }
        
        .win95-contact-textarea {
          resize: none;
        }
        
        .win95-contact-error {
          background: #ffebeb;
          border: 1px solid #ff0000;
          color: #ff0000;
          padding: 8px;
          margin-bottom: 10px;
          font-size: 12px;
        }
        
        .win95-contact-actions {
          display: flex;
          justify-content: center;
        }
        
        .win95-contact-success {
          background: white;
          padding: 20px;
          text-align: center;
          border: 2px solid;
          border-color: var(--win95-border-outer-light) var(--win95-border-outer-dark) var(--win95-border-outer-dark) var(--win95-border-outer-light);
          margin-bottom: 15px;
        }
        
        .win95-contact-success-icon {
          width: 40px;
          height: 40px;
          background: #008000;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin: 0 auto 10px;
        }
        
        .win95-contact-success h3 {
          font-size: 14px;
          margin: 0 0 10px 0;
        }
        
        .win95-contact-success p {
          margin: 0 0 15px 0;
          font-size: 12px;
        }
        

      `}</style>
    </div>
  );
};

export default ContactUsWindow;