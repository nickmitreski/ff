import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FLASH_FORWARD_CONTEXT } from './chatContext';
import { CONVERSATION_EXAMPLES } from './conversationExamples';
import MessagesHeader from './MessagesHeader';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import { trackFeatureUsage, trackAPICall } from '../../../lib/analytics-new';

type Message = {
  sender: 'user' | 'ai';
  text: string;
}

interface MessagesAppProps {
  onClose: () => void;
}

const initialMessages: Message[] = [
  { sender: 'ai', text: 'hey! 👋 what\'s up?' },
];

const SYSTEM_PROMPT = `You're texting like a normal person. Be casual, witty, and fun. Keep responses super short - 1-2 sentences max. Use natural texting language with banter and light sarcasm when appropriate.

Here are examples of how to respond naturally:

${CONVERSATION_EXAMPLES}

Follow these patterns - be conversational, not robotic. React naturally to what they say, use humor, and keep it short and engaging like a real friend would.`;

// Use environment variable for Mistral API key
import { config } from '../../../lib/config';

  const getMistralApiKey = () => config.mistral.apiKey;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_MODEL = 'mistral-tiny'; // Use the cheapest/quickest model

const MessagesApp: React.FC<MessagesAppProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Track iPhone messages usage
    trackFeatureUsage('iphone_messages', 'message_sent', {
      message_length: input.length,
      interface: 'iphone'
    });
    
    const userMsg = { sender: 'user' as const, text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);

    // Prepare chat history for Mistral API
    const mistralMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...[...messages, userMsg].map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
    ];

    try {
      const startTime = Date.now();
      const response = await fetch(MISTRAL_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getMistralApiKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MISTRAL_MODEL,
          messages: mistralMessages,
          max_tokens: 256,
          temperature: 0.3,
        }),
      });
      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      // Track API call
      trackAPICall('mistral', 'POST', response.status, responseTime, {
        model: MISTRAL_MODEL,
        message_count: mistralMessages.length,
        interface: 'iphone'
      });
      
      const aiReply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
      setMessages((msgs) => [...msgs, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((msgs) => [...msgs, { sender: 'ai', text: 'Sorry, there was an error contacting the AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      <MessagesHeader onClose={onClose} />
      
      {/* Messages Container */}
      <div className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100 overflow-y-auto px-4 py-4">
        <div className="space-y-1">
          {messages.map((msg, i) => (
            <MessageBubble key={i} sender={msg.sender} text={msg.text} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 text-sm rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-300">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Bar */}
      <InputBar
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        disabled={loading}
      />
    </motion.div>
  );
};

export default MessagesApp; 