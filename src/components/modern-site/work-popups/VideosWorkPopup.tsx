import React, { useState } from 'react';
import { colors, typography } from '../../../theme/theme';
import { X, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { posthog } from '../../../lib/posthog';

interface VideosWorkPopupProps {
  onClose: () => void;
}

const videoData = [
  {
    title: 'FlashForward Content',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/flashforward_content.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/FlashForward_Content.png',
  },
  {
    title: 'Flash Forward Logo',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/Logo_Flosh_Forward.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/Flash_Forward_Logo_Animation.png',
  },
  {
    title: 'Timelox',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/timelox.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/timelox_promo.png',
  },
  {
    title: 'Reminisce',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/Reminisce_timelox.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/Reminisce.png',
  },
  {
    title: 'Penthouse',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/Penthouse.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/Penthouse.png',
  },
  {
    title: 'Baroq',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/Baroq.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/baroq.png',
  },
  {
    title: 'Colour Pony',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/Colourpony.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/Colour_Pony.png',
  },
  {
    title: 'Better In Colour',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/Better_in_colour_timelox.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/Better_In_Colour.png',
  },
  {
    title: 'FAM',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/FAM.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/FAM.png',
  },
  {
    title: 'The George',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/The_George.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/The_George.png',
  },
];

// Example videos for the offer
const offerExamples = [
  {
    title: 'Timelox',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/timelox.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/timelox_promo.png',
  },
  {
    title: 'Reminisce',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/Reminisce_timelox.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/Reminisce.png',
  },
  {
    title: 'FAM',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/FAM.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/FAM.png',
  },
  {
    title: 'Better In Colour',
    videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/video_work/Better_in_colour_timelox.mp4',
    thumbnail: 'https://file.garden/Zxsc5-9aojhlnJO6/video_thumbnails/Better_In_Colour.png',
  },
];

const VideosWorkPopup: React.FC<VideosWorkPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.yellow; // #FFCC00
  const isMobile = window.innerWidth <= 768;
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [selectedOfferVideo, setSelectedOfferVideo] = useState<number | null>(null);
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryStatus, setEnquiryStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [enquiryError, setEnquiryError] = useState('');

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryEmail.trim()) return;

    setEnquiryStatus('submitting');
    setEnquiryError('');

    try {
      // Track enquiry submission with PostHog
      posthog.capture('promotional_video_enquiry_submitted', {
        email: enquiryEmail,
        source: 'videos_work_popup'
      });

      const { error } = await supabase().from('contact_submissions').insert([
        {
          name: 'Promotional Video Enquiry',
          email: enquiryEmail,
          message: 'Interested in the $600 promotional video special offer from the Videos section.',
          source: 'promotional_video_special',
          timestamp: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      setEnquiryStatus('success');
      setEnquiryEmail('');
      
      // Track successful submission
      posthog.capture('promotional_video_enquiry_success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setEnquiryStatus('idle');
      }, 3000);
    } catch (err) {
      setEnquiryStatus('error');
      setEnquiryError('Failed to submit enquiry. Please try again.');
      console.error('Error submitting enquiry:', err);
      
      // Track error
      posthog.capture('promotional_video_enquiry_error', {
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
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
        className="bg-[#1a1a1a] rounded-lg border border-gray-800 w-full max-w-5xl max-h-[90vh] overflow-auto"
        style={isMobile ? { width: '100%', height: '100%', maxHeight: '100vh', borderRadius: 0 } : {}}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className={`${typography.fontSize['2xl']} ${typography.fontFamily.light} ${typography.tracking.tight} text-white`}>
            Videos
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Promotional Offer Bar */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-yellow-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-yellow-400 font-medium text-sm md:text-base">
                Promotional video special ($600 per promotional or product video) limited time only!
              </p>
            </div>
            <button
              onClick={() => setShowOffer(true)}
              className="ml-4 px-4 py-2 bg-yellow-500 text-black rounded-md font-medium text-sm hover:bg-yellow-400 transition-colors"
            >
              See Offer
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {videoData.map((video, idx) => (
              <button
                key={video.title}
                className="group block bg-black/30 border border-gray-800 rounded-lg overflow-hidden hover:border-yellow-400 transition-colors shadow-lg focus:outline-none"
                style={{ textDecoration: 'none' }}
                onClick={() => setSelectedVideo(idx)}
              >
                <div className="relative aspect-video bg-black/50 flex items-center justify-center">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                  />
                </div>
                <div className="p-2 text-center" style={{ minHeight: 0 }}>
                  <h3
                    className={`${typography.fontSize.lg} ${typography.fontFamily.light} ${typography.tracking.tight}`}
                    style={{ color: buttonColor, margin: 0, padding: 0 }}
                  >
                    {video.title}
                  </h3>
                </div>
              </button>
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

        {/* Video Player Modal */}
        <AnimatePresence>
          {selectedVideo !== null && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-4 shadow-lg"
                style={{ width: '90vw', maxWidth: 800 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-light">{videoData[selectedVideo].title}</h3>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <video
                    src={videoData[selectedVideo].videoUrl}
                    controls
                    style={{ width: '100%', height: '100%', maxWidth: 800, maxHeight: 450, background: 'black' }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Offer Modal */}
        <AnimatePresence>
          {showOffer && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOffer(false)}
            >
              <motion.div
                className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6 shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white text-2xl font-light">Promotional Video Special</h3>
                  <button
                    onClick={() => setShowOffer(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
                    <h4 className="text-yellow-400 text-xl font-medium mb-4">
                      $600 per promotional or product video for a limited time. Includes:
                    </h4>
                    <ul className="text-white space-y-2">
                      <li>• Concept consultation</li>
                      <li>• Up to 60 seconds</li>
                      <li>• Voice over scripts and custom voice</li>
                      <li>• Animated logo</li>
                      <li>• Visual fx</li>
                      <li>• Motion design and transition fx</li>
                      <li>• Custom backing track & sound fx</li>
                      <li>• High quality generated visuals (you can even take photos or send any visuals you want, we can reproduce them in high quality videos, in the same setting or new custom settings)</li>
                    </ul>
                  </div>

                  {/* Enquiry Form */}
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-6 mb-6">
                    <h4 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                      <Mail className="h-5 w-5 text-yellow-400" />
                      Enquire About This Offer
                    </h4>
                    {enquiryStatus === 'success' ? (
                      <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Enquiry Sent!</span>
                        </div>
                        <p className="text-sm">We'll get back to you shortly about your promotional video enquiry.</p>
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
                            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={enquiryStatus === 'submitting' || !enquiryEmail.trim()}
                          className="w-full bg-yellow-500 text-black py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {enquiryStatus === 'submitting' ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Sending Enquiry...
                            </>
                          ) : (
                            'Send Enquiry'
                          )}
                        </button>
                      </form>
                    )}
                  </div>

                  <h4 className="text-white text-lg font-medium mb-4">Examples:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {offerExamples.map((video, idx) => (
                      <button
                        key={video.title}
                        className="group block bg-black/30 border border-gray-800 rounded-lg overflow-hidden hover:border-yellow-400 transition-colors"
                        onClick={() => setSelectedOfferVideo(idx)}
                      >
                        <div className="relative aspect-video bg-black/50 flex items-center justify-center">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                          />
                        </div>
                        <div className="p-3 text-center">
                          <h5 className="text-yellow-400 font-medium text-sm">{video.title}</h5>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowOffer(false)}
                    className="px-6 py-2 bg-yellow-500 text-black rounded-md font-medium hover:bg-yellow-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Offer Video Player Modal */}
        <AnimatePresence>
          {selectedOfferVideo !== null && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOfferVideo(null)}
            >
              <motion.div
                className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-4 shadow-lg"
                style={{ width: '90vw', maxWidth: 800 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-light">{offerExamples[selectedOfferVideo].title}</h3>
                  <button
                    onClick={() => setSelectedOfferVideo(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <video
                    src={offerExamples[selectedOfferVideo].videoUrl}
                    controls
                    style={{ width: '100%', height: '100%', maxWidth: 800, maxHeight: 450, background: 'black' }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default VideosWorkPopup;