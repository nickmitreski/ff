import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { callOpenAI } from '../../../../../lib/llm';
import { trackFeatureUsage, trackGameUsage } from '../../../../../lib/analytics-new';

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi there! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Create a chat session on mount
  useEffect(() => {
    const createSession = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .insert({})
          .select('id');
          
        if (data && data.length > 0 && data[0]?.id) {
          const sessionId = data[0].id as string;
          setSessionId(sessionId);
          // Load any existing messages (should be empty for new session)
          loadMessages(sessionId);
          
          // Add welcome message
          const welcomeMessage: ChatMessage = {
            role: 'assistant',
            content: "Hello! I'm your AI assistant. How can I help you today?"
          };
          setMessages([welcomeMessage]);
          await storeMessage(sessionId, welcomeMessage);
        } else {
          setError('Failed to create chat session.');
        }
      } catch (err) {
        console.error('Error creating session:', err);
        if (err instanceof Error && typeof err.message === 'string') {
          setError(err.message);
        } else {
          setError('Failed to initialize chat');
        }
      }
    };
    
    createSession();
    // eslint-disable-next-line
  }, []);

  // Load messages for a session
  const loadMessages = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    if (data) {
      // Filter and map to ensure each item has 'role' and 'content'
      const filtered = (data as any[]).filter(
        (msg) => typeof msg.role === 'string' && typeof msg.content === 'string'
      ).map(
        (msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          created_at: msg.created_at
        }) as ChatMessage
      );
      setMessages(filtered);
    }
  };

  // Store a message in Supabase
  const storeMessage = async (sessionId: string, msg: ChatMessage) => {
    try {
      await supabase.from('chat_messages').insert({
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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading || !sessionId) return;
    
    // Track chatbot usage
    trackFeatureUsage('chatbot', 'message_sent', {
      message_length: input.length,
      session_id: sessionId,
      interface: 'windows95'
    });
    
    setError(null);
    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setIsTyping(true);
    
    try {
      await storeMessage(sessionId, userMsg);
      
      // Get chat history for context (last 10 messages)
      const history = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add system message for consistent responses
      const systemPrompt = "You are a professional AI assistant for Flash Forward, a digital agency specializing in web design, branding, content creation, and AI services. Your responses should be helpful, informative, and courteous while maintaining a professional tone. If asked about services, mention that Flash Forward offers web design, branding, content creation, AI integration, social media management, and growth strategy services.";
      
      const contextWithSystem = [
        { role: 'system', content: systemPrompt },
        ...history
      ];
      
      // Call the AI
      const response = await callOpenAI(input, contextWithSystem);
      
      // Track successful AI response
      trackFeatureUsage('chatbot', 'ai_response_received', {
        response_length: response.length,
        session_id: sessionId,
        interface: 'windows95'
      });
      
      // Add assistant response
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Store assistant message
      await storeMessage(sessionId, assistantMessage);
    } catch (err) {
      console.error('Error generating response:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong!');
      
      // Track chatbot error
      trackFeatureUsage('chatbot', 'error_occurred', {
        error_message: err instanceof Error ? err.message : String(err),
        session_id: sessionId,
        interface: 'windows95'
      });
      
      // Add a fallback response
      const fallbackMessage: ChatMessage = { 
        role: 'assistant', 
        content: `I apologize, but I'm experiencing some technical difficulties at the moment. Please try again later or contact our team directly for assistance.` 
      };
      setMessages(prev => [...prev, fallbackMessage]);
      await storeMessage(sessionId, fallbackMessage);
    } finally {
      setIsTyping(false);
      setLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [input, loading, sessionId, messages]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  }, [handleSend]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      background: '#bdbdbd' 
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '10px',
        backgroundColor: '#000080',
        padding: '5px',
        color: 'white'
      }}>
        <img 
          src="/90schatbot.png" 
          alt="Chatbot" 
          style={{ width: '24px', height: '24px', marginRight: '10px' }} 
        />
        <h2 style={{ fontSize: '16px', margin: 0 }}>AI Chatbot</h2>
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: 16, 
        background: '#e5e5e5', 
        borderBottom: '1px solid #888' 
      }}>
        {messages.length === 0 && (
          <div style={{ color: '#555', fontStyle: 'italic', marginTop: 32, textAlign: 'center' }}>
            Loading chat...
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={msg.id || i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                background: msg.role === 'user' ? '#c0e0ff' : '#fff',
                color: '#222',
                border: '1px solid #888',
                borderRadius: 6,
                padding: '8px 12px',
                maxWidth: '70%',
                fontFamily: 'monospace',
                boxShadow: msg.role === 'user' ? '2px 2px 0 #a0a0a0' : '2px 2px 0 #e0e0e0',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                background: '#fff',
                color: '#222',
                border: '1px solid #888',
                borderRadius: 6,
                padding: '8px 12px',
                maxWidth: '70%',
                fontFamily: 'monospace',
                boxShadow: '2px 2px 0 #e0e0e0',
              }}
            >
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <style>{`
                .typing-indicator {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                }
                .typing-indicator span {
                  width: 6px;
                  height: 6px;
                  background-color: #888;
                  border-radius: 50%;
                  animation: typing 1s infinite ease-in-out;
                }
                .typing-indicator span:nth-child(1) {
                  animation-delay: 0s;
                }
                .typing-indicator span:nth-child(2) {
                  animation-delay: 0.2s;
                }
                .typing-indicator span:nth-child(3) {
                  animation-delay: 0.4s;
                }
                @keyframes typing {
                  0%, 100% {
                    transform: translateY(0);
                  }
                  50% {
                    transform: translateY(-4px);
                  }
                }
              `}</style>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {error && <div style={{ color: 'red', padding: 8, background: '#fffbe5', borderTop: '1px solid #888' }}>{error}</div>}
      <div style={{ display: 'flex', padding: 12, background: '#d0d0d0', borderTop: '1px solid #888' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type your message..."
          style={{ 
            flex: 1, 
            marginRight: 8, 
            padding: 8, 
            border: '1px solid #888', 
            borderRadius: 4, 
            fontFamily: 'monospace' 
          }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{ 
            padding: '8px 16px', 
            background: '#0CF2A0', 
            color: '#222', 
            border: '1px solid #888', 
            borderRadius: 4, 
            fontWeight: 'bold', 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default memo(Chatbot);