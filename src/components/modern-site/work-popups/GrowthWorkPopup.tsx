import React, { useState } from 'react';
import { colors, typography } from '../../../theme/theme';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

// Use environment variable for Supabase anon key
const getSupabaseAnonKey = () => import.meta.env.VITE_SUPABASE_ANON_KEY || '';

interface GrowthWorkPopupProps {
  onClose: () => void;
}

const GrowthWorkPopup: React.FC<GrowthWorkPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.orange;
  const isMobile = window.innerWidth <= 768;

  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailInvalid = emailTouched && !email;

  async function submitAuditRequest(website_url: string, email: string) {
    const response = await fetch('https://irzgkacsptptspcozrrd.supabase.co/rest/v1/seo_audit_requests', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": getSupabaseAnonKey(),
        "Prefer": "return=representation"
      },
      body: JSON.stringify({ website_url, email })
    });
    if (!response.ok) {
      throw new Error("Failed to submit audit request");
    }
    return await response.json();
  }

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await submitAuditRequest(website, email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-[#1a1a1a] rounded-lg border border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-auto"
        style={isMobile ? { width: '100%', height: '100%', maxHeight: '100vh', borderRadius: 0 } : {}}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img src="/SEO.png" alt="SEO" className="w-8 h-8 rounded-full" />
            <h2 className={`${typography.fontSize['2xl']} ${typography.fontFamily.light} ${typography.tracking.tight} text-white`}>
              SEO Audit Request
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 border-b border-gray-800 bg-black/30">
          {submitted ? (
            <div className="text-center text-lg text-[#0CF2A0] font-light py-8">
              Thank you! We’ll contact you soon with your audit results and suggestions for improvement.
            </div>
          ) : (
            <>
              <h3 className="text-lg font-light text-white mb-4">Get a Free SEO Audit</h3>
              <form className="flex flex-col md:flex-row gap-4 items-stretch md:items-end" onSubmit={handleAudit}>
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Your Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-orange-400 transition-colors"
                    disabled={loading}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Your Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    required
                    placeholder="you@email.com"
                    className={`w-full px-4 py-2 bg-black border ${emailInvalid ? 'border-red-500' : 'border-gray-800'} rounded text-white focus:outline-none focus:border-orange-400 transition-colors`}
                    disabled={loading}
                  />
                  {emailInvalid && (
                    <span className="text-red-500 text-xs mt-1 block">Email is required</span>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0CF2A0] text-black rounded hover:bg-[#07C280] transition-colors font-medium min-w-[160px]"
                  disabled={loading || !email}
                >
                  {loading ? "Submitting..." : "Request Audit"}
                </button>
              </form>
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </>
          )}
        </div>
        <div className="p-6 border-t border-gray-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-black rounded-md transition-colors duration-300 text-sm font-light tracking-tight"
            style={{ backgroundColor: buttonColor }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = `${buttonColor}dd`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = buttonColor;
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GrowthWorkPopup;