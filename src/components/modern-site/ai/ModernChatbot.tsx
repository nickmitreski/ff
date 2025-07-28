import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { callOpenAI } from '../../../lib/llm';
import { Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ModernChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

const ModernChatbot: React.FC<ModernChatbotProps> = ({ 
  isOpen, 
  onClose, 
  onMinimize, 
  isMinimized = false 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi there! 👋 I\'m your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create a chat session on mount
  useEffect(() => {
    if (isOpen) {
      const createSession = async () => {
        try {
          const { data, error } = await supabase()
            .from('chat_sessions')
            .insert({})
            .select('id');
          
          if (data && data.length > 0 && data[0]?.id) {
            setSessionId(data[0].id as string);
          }
        } catch (err) {
          console.error('Error creating session:', err);
        }
      };
      
      createSession();
    }
  }, [isOpen]);

  // Store a message in Supabase
  const storeMessage = async (sessionId: string, msg: ChatMessage) => {
    try {
      await supabase().from('chat_messages').insert({
        session_id: sessionId,
        role: msg.role,
        content: msg.content,
      });
    } catch (err) {
      console.error('Error storing message:', err);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating || !sessionId) return;
    
    // Add user message to state
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);
    
    try {
      // Store user message
      await storeMessage(sessionId, userMessage);
      
      // Get chat history for context (last 10 messages)
      const history = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call DeepSeek API with a professional system prompt
      const systemPrompt = `You are a professional AI assistant for Flash Forward, a digital agency specializing in web design, branding, content creation, and AI services. Your responses should be:
      
      1. Helpful, informative, and courteous
      2. Focused on Flash Forward's services and expertise
      3. Professional in tone while still being conversational
      4. Concise but thorough
      
      If asked about services, mention that Flash Forward offers web design, branding, content creation, AI integration, social media management, and growth strategy services.`;
      
      // Add system message to history
      const contextWithSystem = [
        { role: 'system', content: systemPrompt },
        ...history
      ];
      
      // Call the AI
      const response = await callOpenAI(input, contextWithSystem);
      
      // Add assistant response
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Store assistant message
      await storeMessage(sessionId, assistantMessage);
    } catch (err) {
      console.error('Error generating response:', err);
      
      // Add a fallback response
      const fallbackMessage: ChatMessage = { 
        role: 'assistant', 
        content: `I apologize, but I'm experiencing some technical difficulties at the moment. Please try again later or contact our team directly for assistance.` 
      };
      setMessages(prev => [...prev, fallbackMessage]);
      await storeMessage(sessionId, fallbackMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-24 right-6 z-50"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Chat Box */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 h-96 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">AI</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Flash Forward AI</h3>
                <p className="text-xs opacity-90">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onMinimize && (
                <button
                  onClick={onMinimize}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-2 bg-white text-gray-800 border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 resize-none border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                disabled={isGenerating}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 transition-colors"
                disabled={isGenerating || !input.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModernChatbot;