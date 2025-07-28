import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Image, Mic, X, Video, Phone, Users, Sparkles } from 'lucide-react';
import ModernChatbot from './ModernChatbot';
import ModernImageGenerator from './ModernImageGenerator';
import ModernVoiceAssistant from './ModernVoiceAssistant';
import ComingSoonTool from './ComingSoonTool';

interface AIToolsProps {
  className?: string;
}

type ToolType = 'chatbot' | 'image-generator' | 'voice-assistant' | 'video-generator' | 'voice-sales' | 'lead-generator' | 'ai-assistant';

const AITools: React.FC<AIToolsProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(false);
  
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
              <div className="text-center text-gray-400">
                <p className="text-sm mb-4">Click the chatbot button to start chatting!</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={openChatbot}
                    className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Bot size={24} className="mx-auto mb-2 text-blue-400" />
                    <span className="text-xs">Chatbot</span>
                  </button>
                  <div className="p-3 bg-gray-800 rounded-lg opacity-50">
                    <Image size={24} className="mx-auto mb-2 text-yellow-400" />
                    <span className="text-xs">Image Gen</span>
                  </div>
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
    </div>
  );
};

export default AITools;