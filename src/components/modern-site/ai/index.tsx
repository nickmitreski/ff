import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Image, Mic, X, Video, Phone, Users, Sparkles, Mail } from 'lucide-react';
import ModernChatbot from './ModernChatbot';
import ModernImageGenerator from './ModernImageGenerator';
import ModernVoiceAssistant from './ModernVoiceAssistant';
import ComingSoonTool from './ComingSoonTool';
import { supabase } from '../../../lib/supabase';

interface AIToolsProps {
  className?: string;
}

interface ComingSoonEmailFormProps {
  feature: string;
  color: string;
  onClose: () => void;
}

const ComingSoonEmailForm: React.FC<ComingSoonEmailFormProps> = ({ feature, color, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase()
        .from('coming_soon_notifications')
        .insert({
          email: email.trim(),
          feature: feature,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error submitting notification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-500',
          hover: 'hover:bg-green-600',
          text: 'text-green-600',
          border: 'border-green-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          hover: 'hover:bg-purple-600',
          text: 'text-purple-600',
          border: 'border-purple-500'
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-500',
          hover: 'hover:bg-indigo-600',
          text: 'text-indigo-600',
          border: 'border-indigo-500'
        };
      default:
        return {
          bg: 'bg-blue-500',
          hover: 'hover:bg-blue-600',
          text: 'text-blue-600',
          border: 'border-blue-500'
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div className="w-full">
      {isSubmitted ? (
        <div className="text-center">
          <div className={`bg-${color}-100 border border-${color}-300 rounded-lg p-4 mb-4`}>
            <p className={`text-${color}-700 text-sm font-medium`}>
              Thank you! We'll notify you when {feature} is ready.
            </p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className={`text-${color}-600 hover:text-${color}-700 text-sm font-medium`}
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className={`w-full ${colors.bg} ${colors.hover} disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors font-medium`}
          >
            {isLoading ? 'Submitting...' : 'Get Notified'}
          </button>
        </form>
      )}
    </div>
  );
};

type ToolType = 'chatbot' | 'image-generator' | 'voice-assistant' | 'video-generator' | 'voice-sales' | 'lead-generator' | 'ai-assistant' | 'phone-receptionist' | 'email-sales';

const AITools: React.FC<AIToolsProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(false);
  const [isPhoneReceptionistOpen, setIsPhoneReceptionistOpen] = useState(false);
  const [isEmailSalesOpen, setIsEmailSalesOpen] = useState(false);
  const [isPersonalAssistantOpen, setIsPersonalAssistantOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const openChatbot = () => {
    setIsChatbotOpen(true);
    setIsChatbotMinimized(false);
    setIsOpen(false); // Close the tools panel
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
  };

  const toggleChatbotMinimize = () => {
    setIsChatbotMinimized(!isChatbotMinimized);
  };

  const openPhoneReceptionist = () => {
    setIsPhoneReceptionistOpen(true);
    setIsOpen(false);
  };

  const closePhoneReceptionist = () => {
    setIsPhoneReceptionistOpen(false);
  };

  const openEmailSales = () => {
    setIsEmailSalesOpen(true);
    setIsOpen(false);
  };

  const closeEmailSales = () => {
    setIsEmailSalesOpen(false);
  };

  const openPersonalAssistant = () => {
    setIsPersonalAssistantOpen(true);
    setIsOpen(false);
  };

  const closePersonalAssistant = () => {
    setIsPersonalAssistantOpen(false);
  };
  
  return (
    <div className={`fixed bottom-24 right-6 z-40 ${className}`}>
      {/* Floating button */}
      <button
        onClick={toggleOpen}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg"
      >
        <Bot size={24} />
      </button>
      
      {/* AI Tools Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
              opacity: 0,
              ...(isMobile 
                ? { scale: 1, y: 0 } 
                : { scale: 0.9, y: 20 })
            }}
            animate={{ 
              opacity: 1, 
              ...(isMobile 
                ? { scale: 1, y: 0 } 
                : { scale: 1, y: 0 })
            }}
            exit={{ 
              opacity: 0, 
              ...(isMobile 
                ? { scale: 1, y: 0 } 
                : { scale: 0.9, y: 20 })
            }}
            className={isMobile 
              ? "fixed inset-0 bg-[#0a0a0a] z-50" 
              : "absolute bottom-16 right-0 w-[400px] h-[500px] bg-[#0a0a0a] rounded-lg border border-gray-800 shadow-xl overflow-hidden"
            }
            style={isMobile ? { position: 'fixed' } : {}}
          >
            <div className="flex justify-between items-center p-3 border-b border-gray-800">
              <div className="flex gap-2">
                <button
                  className={`p-2 rounded-md ${isChatbotOpen ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={openChatbot}
                >
                  <Bot size={20} />
                </button>
              </div>
              <button
                onClick={toggleOpen}
                className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            <div className="h-[calc(100%-48px)] p-4">
              <div className="text-center text-gray-400 mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">AI Custom Tools & Services</h3>
                <p className="text-sm">Click any tool to get started!</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={openChatbot}
                  className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Bot size={24} className="mx-auto mb-2 text-blue-400" />
                  <span className="text-xs">Chatbot</span>
                </button>
                <button
                  onClick={openPhoneReceptionist}
                  className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Phone size={24} className="mx-auto mb-2 text-green-400" />
                  <span className="text-xs">Phone Receptionist</span>
                </button>
                <button
                  onClick={openEmailSales}
                  className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Mail size={24} className="mx-auto mb-2 text-purple-400" />
                  <span className="text-xs">Email Sales Agent</span>
                </button>
                <button
                  onClick={openPersonalAssistant}
                  className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Sparkles size={24} className="mx-auto mb-2 text-indigo-400" />
                  <span className="text-xs">AI Personal Assistant</span>
                </button>
                <div className="p-3 bg-gray-800 rounded-lg opacity-50">
                  <Image size={24} className="mx-auto mb-2 text-yellow-400" />
                  <span className="text-xs">Image Gen</span>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg opacity-50">
                  <Video size={24} className="mx-auto mb-2 text-red-400" />
                  <span className="text-xs">Video Gen</span>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg opacity-50">
                  <Phone size={24} className="mx-auto mb-2 text-pink-400" />
                  <span className="text-xs">Voice Sales</span>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg opacity-50">
                  <Users size={24} className="mx-auto mb-2 text-purple-400" />
                  <span className="text-xs">Lead Generator</span>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg opacity-50">
                  <Mic size={24} className="mx-auto mb-2 text-green-400" />
                  <span className="text-xs">AI Voicebot</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Popup */}
      <ModernChatbot
        isOpen={isChatbotOpen}
        onClose={closeChatbot}
        onMinimize={toggleChatbotMinimize}
        isMinimized={isChatbotMinimized}
      />

      {/* Phone Receptionist Popup */}
      <AnimatePresence>
        {isPhoneReceptionistOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 h-96 flex flex-col overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Phone Receptionist</h3>
                    <p className="text-xs opacity-90">Coming Soon</p>
                  </div>
                </div>
                <button
                  onClick={closePhoneReceptionist}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 p-6 bg-gray-50">
                <div className="text-center mb-6">
                  <Phone size={48} className="mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">AI Phone Receptionist</h3>
                  <p className="text-sm text-gray-600">AI-powered phone answering and call routing that handles customer inquiries professionally.</p>
                </div>
                <ComingSoonEmailForm 
                  feature="AI Phone Receptionist"
                  color="green"
                  onClose={closePhoneReceptionist}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Sales Agent Popup */}
      <AnimatePresence>
        {isEmailSalesOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 h-96 flex flex-col overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Email Sales Agent</h3>
                    <p className="text-xs opacity-90">Coming Soon</p>
                  </div>
                </div>
                <button
                  onClick={closeEmailSales}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 p-6 bg-gray-50">
                <div className="text-center mb-6">
                  <Mail size={48} className="mx-auto mb-4 text-purple-500" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Email Sales Agent</h3>
                  <p className="text-sm text-gray-600">Automated email responses and lead nurturing that converts prospects into customers.</p>
                </div>
                <ComingSoonEmailForm 
                  feature="Email Sales Agent"
                  color="purple"
                  onClose={closeEmailSales}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Personal Assistant Popup */}
      <AnimatePresence>
        {isPersonalAssistantOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 h-96 flex flex-col overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Personal Assistant</h3>
                    <p className="text-xs opacity-90">Coming Soon</p>
                  </div>
                </div>
                <button
                  onClick={closePersonalAssistant}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 p-6 bg-gray-50">
                <div className="text-center mb-6">
                  <Sparkles size={48} className="mx-auto mb-4 text-indigo-500" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">AI Personal Assistant</h3>
                  <p className="text-sm text-gray-600">Personalized digital assistants that help streamline workflows and boost productivity.</p>
                </div>
                <ComingSoonEmailForm 
                  feature="AI Personal Assistant"
                  color="indigo"
                  onClose={closePersonalAssistant}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AITools;