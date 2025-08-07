import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Minimize2, Maximize2 } from 'lucide-react';
import ModernChatbot from './ModernChatbot';

interface AIToolsProps {
  className?: string;
}

const AITools: React.FC<AIToolsProps> = ({ className = "" }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(false);
  
  const openChatbot = () => {
    setIsChatbotOpen(true);
    setIsChatbotMinimized(false);
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
  };

  const toggleChatbotMinimize = () => {
    setIsChatbotMinimized(!isChatbotMinimized);
  };
  
  return (
    <div className={`fixed bottom-24 right-6 z-40 ${className}`}>
      {/* Floating Chatbot Button */}
      <button
        onClick={openChatbot}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
      >
        <Bot size={24} />
      </button>
      
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