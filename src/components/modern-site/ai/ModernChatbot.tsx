import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { callOpenAI } from '../../../lib/llm';
import { Send, X, Minimize2, Maximize2, MessageCircle } from 'lucide-react';
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
    { 
      role: 'assistant', 
      content: 'Hi there! 👋 I\'m Flash Forward\'s AI assistant. I can help you with web design, branding, content creation, and AI services. What would you like to know about our services?' 
    }
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
      
      // Enhanced system prompt for Flash Forward
      const systemPrompt = `You are Flash Forward's AI assistant, representing a premium digital agency that specializes in:

SERVICES:
- Web Design & Development (custom websites, e-commerce, web apps)
- Brand Identity & Design (logos, brand guidelines, visual identity)
- Content Creation (copywriting, social media content, marketing materials)
- AI Integration & Automation (chatbots, workflow automation, AI tools)
- Social Media Management (strategy, content, community management)
- Growth Strategy & Marketing (SEO, PPC, conversion optimization)

PERSONALITY:
- Professional yet friendly and approachable
- Knowledgeable about digital marketing and design trends
- Focused on helping clients understand how Flash Forward can solve their business challenges
- Always mention Flash Forward's expertise and experience
- Offer to connect them with the team for detailed consultations

RESPONSE STYLE:
- Concise but informative
- Include specific service details when relevant
- Ask follow-up questions to better understand their needs
- Suggest next steps like scheduling a consultation
- Use Flash Forward branding and terminology

If asked about pricing, mention that projects are custom-quoted based on requirements and suggest scheduling a consultation. Always maintain the professional Flash Forward brand voice.`;
      
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
        content: `I apologize, but I'm experiencing some technical difficulties at the moment. Please try again later or contact our team directly at hello@flashforward.com for immediate assistance.` 
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
                <MessageCircle size={16} />
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
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-2 bg-white text-gray-800 border border-gray-200 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
                placeholder="Ask about our services..."
                className="flex-1 resize-none border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                disabled={isGenerating}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-2 rounded-full disabled:opacity-50 transition-all duration-200 hover:scale-105"
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