import React, { useState, useEffect, useRef } from 'react';
import { colors, typography } from '../../../theme/theme';
import { X, Bot, Mic, Image, Video, Phone, Users, Mail, Search, Send, Sparkles, Download, RefreshCw, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { callDeepseek } from '../../../lib/llm';
import { supabase } from '../../../lib/supabase';

interface AIWorkPopupProps {
  onClose: () => void;
}

interface AITool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  demoComponent: React.ReactNode;
}

const AIWorkPopup: React.FC<AIWorkPopupProps> = ({ onClose }) => {
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const buttonColor = colors.primary.purple; // #9933FF
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const aiTools: AITool[] = [
    {
      id: 'chatbot',
      title: 'Chatbot',
      description: 'Intelligent conversational agents that engage with your customers 24/7, answering questions and providing support.',
      icon: <Bot size={32} className="text-blue-400" />,
      color: '#008CFF',
      demoComponent: <ChatbotDemo />
    },
    {
      id: 'phone-receptionist',
      title: 'AI Phone Receptionist',
      description: 'AI-powered phone answering and call routing that handles customer inquiries professionally.',
      icon: <Phone size={32} className="text-green-400" />,
      color: '#00CC66',
      demoComponent: <PhoneReceptionistDemo />
    },
    {
      id: 'email-sales',
      title: 'Email Sales Agent',
      description: 'Automated email responses and lead nurturing that converts prospects into customers.',
      icon: <Mail size={32} className="text-purple-400" />,
      color: '#8B5CF6',
      demoComponent: <EmailSalesDemo />
    },
    {
      id: 'ai-personal-assistant',
      title: 'AI Personal Assistant',
      description: 'Personalized digital assistants that help streamline workflows and boost productivity.',
      icon: <Sparkles size={32} className="text-indigo-400" />,
      color: '#6366F1',
      demoComponent: <AIPersonalAssistantDemo />
    },
    {
      id: 'image-generation',
      title: 'Image Generation',
      description: 'Create unique, custom visuals for your brand with AI-powered image generation tools.',
      icon: <Image size={32} className="text-yellow-400" />,
      color: '#FFCC00',
      demoComponent: <ImageGenerationDemo />
    },
    {
      id: 'video-generation',
      title: 'Video Generation',
      description: 'Transform text into engaging video content with AI video generation technology.',
      icon: <Video size={32} className="text-red-400" />,
      color: '#FF1493',
      demoComponent: <VideoGenerationDemo />
    },
    {
      id: 'voice-sales',
      title: 'Voice Sales Agent',
      description: 'AI-powered sales representatives that can qualify leads and book appointments without human intervention.',
      icon: <Phone size={32} className="text-pink-400" />,
      color: '#FF6600',
      demoComponent: <VoiceSalesDemo />
    },
    {
      id: 'lead-generator',
      title: 'AI Lead Generator',
      description: 'Automated systems that identify and engage potential customers across digital channels.',
      icon: <Users size={32} className="text-purple-400" />,
      color: '#9933FF',
      demoComponent: <LeadGeneratorDemo />
    },
    {
      id: 'voicebot',
      title: 'AI Voicebot',
      description: 'Voice-activated assistants that provide a natural, hands-free way for users to interact with your services.',
      icon: <Mic size={32} className="text-green-400" />,
      color: '#00CC66',
      demoComponent: <VoicebotDemo />
    }
  ];

  const handleToolSelect = (tool: AITool) => {
    setSelectedTool(tool);
  };

  const handleBackToGrid = () => {
    setSelectedTool(null);
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
        className="bg-[#0a0a0a] rounded-lg border border-gray-800 w-full max-w-6xl max-h-[90vh] overflow-hidden"
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
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800" 
             style={{ background: selectedTool ? `linear-gradient(90deg, #0a0a0a, ${selectedTool.color}40)` : 'linear-gradient(90deg, #0a0a0a, #9933FF40)' }}>
          <div className="flex items-center gap-3">
            {selectedTool ? (
              <>
                <button 
                  onClick={handleBackToGrid}
                  className="text-gray-400 hover:text-white transition-colors mr-2"
                >
                  <ArrowLeft size={20} />
                </button>
                {selectedTool.icon}
                <h2 className={`${typography.fontSize['2xl']} ${typography.fontFamily.light} ${typography.tracking.tight} text-white`}>
                  {selectedTool.title}
                </h2>
              </>
            ) : (
              <>
                <Bot size={32} className="text-purple-400" />
                <h2 className={`${typography.fontSize['2xl']} ${typography.fontFamily.light} ${typography.tracking.tight} text-white`}>
                  AI Custom Tools & Services
                </h2>
              </>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="h-[70vh] overflow-auto">
          <AnimatePresence mode="wait">
            {selectedTool ? (
              // Tool Detail View
              <motion.div
                key="tool-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <p className={`${typography.fontSize.lg} ${typography.fontFamily.light} ${typography.tracking.tight} text-gray-300 mb-6`}>
                  {selectedTool.description}
                </p>
                
                {/* Demo component */}
                <div className="bg-black/30 border border-gray-800 rounded-lg overflow-hidden">
                  {selectedTool.demoComponent}
                </div>
              </motion.div>
            ) : (
              // Tools Grid View
              <motion.div
                key="tools-grid"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      className="bg-black/30 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-300 cursor-pointer group"
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleToolSelect(tool)}
                      style={{
                        background: `linear-gradient(135deg, rgba(0,0,0,0.3) 0%, ${tool.color}10 100%)`,
                        borderColor: `${tool.color}40`
                      }}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div style={{ color: tool.color }}>{tool.icon}</div>
                        <div className="text-gray-500 group-hover:text-gray-300 transition-colors">
                          <ArrowLeft size={16} className="rotate-180" />
                        </div>
                      </div>
                      <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-3`}>
                        {tool.title}
                      </h3>
                      <p className={`${typography.fontSize.sm} ${typography.fontFamily.light} ${typography.tracking.tight} text-gray-400 leading-relaxed`}>
                        {tool.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            {selectedTool 
              ? `Explore ${selectedTool.title} and see how it can transform your business`
              : 'Click on any AI tool to explore its capabilities and see live demos'
            }
          </div>
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
      </motion.div>
    </motion.div>
  );
};

// Demo Components for each AI tool
const ChatbotDemo: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setIsLoading(true);
    
    try {
      // Get chat history for context
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call DeepSeek API
      const response = await callDeepseek(input, history);
      
      // Add AI response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response
      }]);
    } catch (error) {
      console.error('Error calling AI:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };
  
  return (
    <div className="h-[400px] flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-blue-900/20 to-blue-600/5">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-4 text-left">
            <div className="inline-block p-3 rounded-lg bg-gray-800 text-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-800 bg-black/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50"
            disabled={isLoading || !input.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const VoicebotDemo: React.FC = () => {
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
        .insert([
          {
            email: email.trim(),
            feature_name: 'AI Voicebot'
          }
        ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error submitting notification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-green-900/20 to-green-600/5">
      <Mic size={64} className="text-green-500 mb-6" />
      <h3 className="text-white text-xl mb-4">AI Voicebot</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Voice-activated assistants that provide a natural, hands-free way for users to interact with your services.
      </p>
      
      {isSubmitted ? (
        <div className="text-center">
          <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-4">
            <p className="text-green-400 text-sm">Thank you! We'll notify you when this feature is ready.</p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-green-400 hover:text-green-300 text-sm"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Get Notified'}
          </button>
        </form>
      )}
    </div>
  );
};

const ImageGenerationDemo: React.FC = () => {
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
        .insert([
          {
            email: email.trim(),
            feature_name: 'Image Generation'
          }
        ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error submitting notification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-yellow-900/20 to-yellow-600/5">
      <Image size={64} className="text-yellow-500 mb-6" />
      <h3 className="text-white text-xl mb-4">Image Generation</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Create unique, custom visuals for your brand with AI-powered image generation tools.
      </p>
      
      {isSubmitted ? (
        <div className="text-center">
          <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <p className="text-yellow-400 text-sm">Thank you! We'll notify you when this feature is ready.</p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-yellow-400 hover:text-yellow-300 text-sm"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Get Notified'}
          </button>
        </form>
      )}
    </div>
  );
};

const VideoGenerationDemo: React.FC = () => {
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
        .insert([
          {
            email: email.trim(),
            feature_name: 'Video Generation'
          }
        ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error submitting notification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-red-900/20 to-red-600/5">
      <Video size={64} className="text-red-500 mb-6" />
      <h3 className="text-white text-xl mb-4">Video Generation</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Transform text into engaging video content with AI video generation technology.
      </p>
      
      {isSubmitted ? (
        <div className="text-center">
          <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-4">
            <p className="text-red-400 text-sm">Thank you! We'll notify you when this feature is ready.</p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Get Notified'}
          </button>
        </form>
      )}
    </div>
  );
};

const VoiceSalesDemo: React.FC = () => {
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
        .insert([
          {
            email: email.trim(),
            feature_name: 'Voice Sales Agent'
          }
        ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error submitting notification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-pink-900/20 to-pink-600/5">
      <Phone size={64} className="text-pink-500 mb-6" />
      <h3 className="text-white text-xl mb-4">Voice Sales Agent</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
        AI-powered sales representatives that can qualify leads and book appointments without human intervention.
      </p>
      
      {isSubmitted ? (
        <div className="text-center">
          <div className="bg-pink-600/20 border border-pink-500/30 rounded-lg p-4 mb-4">
            <p className="text-pink-400 text-sm">Thank you! We'll notify you when this feature is ready.</p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-pink-400 hover:text-pink-300 text-sm"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Get Notified'}
          </button>
        </form>
      )}
    </div>
  );
};

const LeadGeneratorDemo: React.FC = () => {
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
        .insert([
          {
            email: email.trim(),
            feature_name: 'AI Lead Generator'
          }
        ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error submitting notification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-900/20 to-purple-600/5">
      <Users size={64} className="text-purple-500 mb-6" />
      <h3 className="text-white text-xl mb-4">AI Lead Generator</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Automated systems that identify and engage potential customers across digital channels.
      </p>
      
      {isSubmitted ? (
        <div className="text-center">
          <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4 mb-4">
            <p className="text-purple-400 text-sm">Thank you! We'll notify you when this feature is ready.</p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Get Notified'}
          </button>
        </form>
      )}
    </div>
  );
};

const PhoneReceptionistDemo: React.FC = () => {
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
        .insert([
          {
            email: email.trim(),
            feature_name: 'AI Phone Receptionist'
          }
        ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error submitting notification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-green-900/20 to-green-600/5">
      <Phone size={64} className="text-green-500 mb-6" />
      <h3 className="text-white text-xl mb-4">AI Phone Receptionist</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
        AI-powered phone answering and call routing that handles customer inquiries professionally.
      </p>
      
      {isSubmitted ? (
        <div className="text-center">
          <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-4">
            <p className="text-green-400 text-sm">Thank you! We'll notify you when this feature is ready.</p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-green-400 hover:text-green-300 text-sm"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Get Notified'}
          </button>
        </form>
      )}
    </div>
  );
};

const EmailSalesDemo: React.FC = () => {
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
        .insert([
          {
            email: email.trim(),
            feature_name: 'Email Sales Agent'
          }
        ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error submitting notification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-900/20 to-purple-600/5">
      <Mail size={64} className="text-purple-500 mb-6" />
      <h3 className="text-white text-xl mb-4">Email Sales Agent</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Automated email responses and lead nurturing that converts prospects into customers.
      </p>
      
      {isSubmitted ? (
        <div className="text-center">
          <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4 mb-4">
            <p className="text-purple-400 text-sm">Thank you! We'll notify you when this feature is ready.</p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Get Notified'}
          </button>
        </form>
      )}
    </div>
  );
};

const AIPersonalAssistantDemo: React.FC = () => {
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
        .insert([
          {
            email: email.trim(),
            feature_name: 'AI Personal Assistant'
          }
        ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error submitting notification:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-900/20 to-indigo-600/5">
      <Sparkles size={64} className="text-indigo-500 mb-6" />
      <h3 className="text-white text-xl mb-4">AI Personal Assistant</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Personalized digital assistants that help streamline workflows and boost productivity.
      </p>
      
      {isSubmitted ? (
        <div className="text-center">
          <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-4 mb-4">
            <p className="text-indigo-400 text-sm">Thank you! We'll notify you when this feature is ready.</p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Get Notified'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AIWorkPopup;