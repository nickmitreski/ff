import React, { useState, useEffect } from 'react';
import { colors, typography } from '../../../theme/theme';
import { X, ChevronLeft, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { posthog } from '../../../lib/posthog';

interface WebDesignWorkPopupProps {
  onClose: () => void;
}

interface WebsiteProject {
  id: string;
  title: string;
  url: string;
  description: string;
  technologies: string[];
  features: string[];
  imageUrl: string;
  color: string;
}

const WebDesignWorkPopup: React.FC<WebDesignWorkPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.blue; // #008CFF
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const [currentProject, setCurrentProject] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [, setShowIframe] = useState(false);
  const [showWebsiteSpecial, setShowWebsiteSpecial] = useState(false);
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryStatus, setEnquiryStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [enquiryError, setEnquiryError] = useState('');
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const websiteProjects: WebsiteProject[] = [
    {
      id: 'mg-accounting',
      title: 'MG Accounting',
      url: 'https://www.mgaccounting.com.au/',
      description: `A professional website for an accounting firm that balances corporate trustworthiness with approachable design. The site features clear service descriptions, team profiles, and contact information to convert visitors into clients.`,
      technologies: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
      features: ['Responsive Design', 'Service Showcases', 'Team Profiles', 'Contact Form Integration'],
      imageUrl: '/mgaccounting.png',
      color: '#008CFF'
    },
    {
      id: 'followfuse',
      title: 'FollowFuse',
      url: 'https://www.followfuse.com/',
      description: `A dynamic platform for social media management and analytics. The website presents a modern, tech-forward aesthetic with interactive elements that demonstrate the product's capabilities.`,
      technologies: ['React', 'TypeScript', 'Styled Components', 'Chart.js'],
      features: ['Interactive Dashboard Demo', 'Feature Showcase', 'Pricing Tables', 'User Testimonials'],
      imageUrl: '/followfuse.png',
      color: '#FF1493'
    },
    {
      id: 'boostr',
      title: 'Boostr',
      url: 'https://boostr-seven.vercel.app/',
      description: `A performance-focused website for a fitness coaching platform. The design emphasizes motivation and results with strong visuals and clear calls to action.`,
      technologies: ['Next.js', 'Tailwind CSS', 'Supabase', 'Vercel'],
      features: ['Program Showcases', 'Coach Profiles', 'Testimonial Carousel', 'Membership Portal'],
      imageUrl: '/brands/boostr.png',
      color: '#FFCC00'
    },
    {
      id: '1-step-ahead',
      title: '1 Step Ahead',
      url: 'https://1stepahead.vercel.app/',
      description: `An educational platform website with a clean, intuitive design that prioritizes content accessibility and user engagement. The site features course listings, instructor profiles, and learning resources.`,
      technologies: ['React', 'Next.js', 'Material UI', 'MongoDB'],
      features: ['Course Catalog', 'Learning Dashboard', 'Progress Tracking', 'Resource Library'],
      imageUrl: '/1stepahead.png',
      color: '#00CC66'
    },
    {
      id: 'followfuseapp',
      title: 'FollowFuseApp',
      url: 'https://followfuseapp.com/',
      description: `A mobile app landing page that showcases the FollowFuse application's features and benefits. The design uses app screenshots and interactive elements to demonstrate functionality.`,
      technologies: ['React', 'Gatsby', 'Tailwind CSS', 'Netlify'],
      features: ['App Feature Showcase', 'Interactive Demo', 'Download Links', 'User Reviews'],
      imageUrl: '/followfuseapp.png',
      color: '#9933FF'
    },
    {
      id: 'timelox',
      title: 'Timelox',
      url: 'https://timelox-website.vercel.app/',
      description: `A sleek, modern website for a time management application. The design emphasizes productivity and efficiency with a clean interface and subtle animations.`,
      technologies: ['Vue.js', 'Nuxt.js', 'SCSS', 'Firebase'],
      features: ['Feature Tours', 'Pricing Plans', 'User Testimonials', 'Blog Section'],
      imageUrl: '/timelox.png',
      color: '#FF6600'
    }
  ];

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryEmail.trim()) return;

    setEnquiryStatus('submitting');
    setEnquiryError('');

    try {
      // Track enquiry submission with PostHog
      posthog.capture('website_enterprise_enquiry_submitted', {
        email: enquiryEmail,
        source: 'websites_work_popup'
      });

      const { error } = await supabase().from('contact_submissions').insert([
        {
          name: 'Website Enterprise Package Enquiry',
          email: enquiryEmail,
          message: 'Interested in the $999 Enterprise package special offer from the Websites section.',
          source: 'website_enterprise_special',
          timestamp: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      setEnquiryStatus('success');
      setEnquiryEmail('');
      
      // Track successful submission
      posthog.capture('website_enterprise_enquiry_success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setEnquiryStatus('idle');
      }, 3000);
    } catch (err) {
      setEnquiryStatus('error');
      setEnquiryError('Failed to submit enquiry. Please try again.');
      console.error('Error submitting enquiry:', err);
      
      // Track error
      posthog.capture('website_enterprise_enquiry_error', {
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };
  
  
  const prevProject = () => {
    setIsImageLoading(true);
    setIframeLoading(true);
    setShowIframe(false);
    setCurrentProject((prev) => (prev - 1 + websiteProjects.length) % websiteProjects.length);
  };
  
  const project = websiteProjects[currentProject];

  // Reset iframe loading state when project changes
  useEffect(() => {
    setIframeLoading(true);
    setShowIframe(false);
  }, [currentProject]);
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-[#1a1a1a] rounded-lg border border-gray-800 w-full max-w-5xl max-h-[90vh] overflow-auto"
        style={isMobile ? { width: '100%', height: '100%', maxHeight: '100vh', borderRadius: 0 } : {}}
        initial={isMobile ? 
          { opacity: 0 } : 
          { scale: 0.9, opacity: 0 }
        }
        animate={isMobile ? 
          { opacity: 1 } : 
          { scale: 1, opacity: 1 }
        }
        exit={isMobile ? 
          { opacity: 0 } : 
          { scale: 0.9, opacity: 0 }
        }
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className={`${typography.fontSize['2xl']} ${typography.fontFamily.light} ${typography.tracking.tight} text-white`}>
            Websites
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Website Special Offer Bar */}
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-b border-blue-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-blue-400 font-medium text-sm md:text-base">
                🚨 LIMITED TIME OFFER: Enterprise package for only $999 (Only 8 spots left!)
              </p>
            </div>
            <button
              onClick={() => setShowWebsiteSpecial(true)}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md font-medium text-sm hover:bg-blue-400 transition-colors"
            >
              View Special
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {websiteProjects.map((project) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-black/30 border border-gray-800 rounded-lg overflow-hidden hover:border-blue-400 transition-colors shadow-lg"
                style={{ textDecoration: 'none' }}
              >
                <div className="relative aspect-video bg-black/50 flex items-center justify-center">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                  />
                </div>
                <div className="p-2 text-center" style={{ minHeight: 0 }}>
                  <h3
                    className={`${typography.fontSize.lg} ${typography.fontFamily.light} ${typography.tracking.tight}`}
                    style={{ color: colors.primary.blue, margin: 0, padding: 0 }}
                  >
                    {project.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-gray-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-black rounded-md transition-colors duration-300 text-sm font-light tracking-tight"
            style={{ 
              backgroundColor: buttonColor,
            }}
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

        {/* Website Special Modal */}
        <AnimatePresence>
          {showWebsiteSpecial && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWebsiteSpecial(false)}
            >
              <motion.div
                className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6 shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white text-2xl font-light">🚨 LIMITED TIME WEBSITE SPECIAL</h3>
                  <button
                    onClick={() => setShowWebsiteSpecial(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                    <div className="text-center mb-6">
                      <h4 className="text-blue-400 text-3xl font-bold mb-2">Enterprise Package</h4>
                      <div className="text-white text-5xl font-bold mb-2">$999</div>
                      <p className="text-gray-300 text-lg">Limited Time Only - Only 8 Spots Left!</p>
                      <p className="text-gray-400 text-sm mt-2">Regular Price: $2,499 - Save $1,500!</p>
                    </div>
                    
                    <h5 className="text-blue-400 text-xl font-medium mb-4">Everything Included:</h5>
                    <ul className="text-white space-y-2">
                      <li>• Custom Website Design</li>
                      <li>• Up to 10 pages</li>
                      <li>• Mobile Responsive</li>
                      <li>• Advanced onsite SEO</li>
                      <li>• Social Media Setup</li>
                      <li>• Promotional or explainer video for website</li>
                      <li>• Analytics Setup</li>
                      <li>• Custom Features</li>
                      <li>• API Integrations</li>
                      <li>• Performance Optimization</li>
                      <li>• 6 Months Support</li>
                      <li>• Custom backend CRM / Dashboard</li>
                      <li>• 2 x custom AI automation set ups</li>
                    </ul>
                  </div>

                  {/* Enquiry Form */}
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-6 mb-6">
                    <h4 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-400" />
                      Enquire About This Special Offer
                    </h4>
                    {enquiryStatus === 'success' ? (
                      <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Enquiry Sent!</span>
                        </div>
                        <p className="text-sm">We'll get back to you shortly about your Enterprise package enquiry.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleEnquirySubmit} className="space-y-4">
                        {enquiryStatus === 'error' && (
                          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm">
                            {enquiryError}
                          </div>
                        )}
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={enquiryEmail}
                            onChange={(e) => setEnquiryEmail(e.target.value)}
                            placeholder="Enter your email to enquire"
                            required
                            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={enquiryStatus === 'submitting' || !enquiryEmail.trim()}
                          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {enquiryStatus === 'submitting' ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Sending Enquiry...
                            </>
                          ) : (
                            'Claim This Special Offer'
                          )}
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      ⚡ This special offer is limited to only 8 clients. Don't miss out on saving $1,500 on our comprehensive Enterprise package!
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowWebsiteSpecial(false)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default WebDesignWorkPopup;