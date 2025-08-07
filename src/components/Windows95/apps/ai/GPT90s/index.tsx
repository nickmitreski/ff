import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { callDeepseek } from '../../../../../lib/llm';
import { supabase } from '../../../../../lib/supabase';
import '../../../../../styles/90sGPT.css';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const GPT90s: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          // Add welcome message
          const welcomeMessage: ChatMessage = {
            role: 'assistant',
            content: "Welcome to 90sGPT! I'm running on a Pentium processor with 16MB of RAM. What can I help you with today? :-)"
          };
          setMessages([welcomeMessage]);
          await storeMessage(sessionId, welcomeMessage);
        } else {
          setError('Failed to create chat session');
        }
      } catch (err) {
        console.error('Error creating session:', err);
        setError('Failed to initialize chat');
      }
    };
    
    createSession();
  }, []);

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = useCallback(async () => {
    if (!prompt.trim() || !sessionId) return;
    
    setIsGenerating(true);
    setError(null);
    
    // Add user message to state
    const userMessage: ChatMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    
    try {
      // Store user message
      await storeMessage(sessionId, userMessage);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Get chat history for context (last 10 messages)
      const history = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call DeepSeek API with delay to simulate 90s internet
      try {
        // Add 90s-specific system prompt
        const systemPrompt = "You are 90sGPT, a professional AI assistant from 1996. You have the following characteristics:\n\n1. KNOWLEDGE BASE:\n- You have extensive knowledge up to 1996 only\n- You're unaware of events, technology, or cultural developments after 1996\n- You use references to Windows 95, early internet, and 90s computing\n\n2. PROFESSIONAL TONE:\n- You are helpful, informative, and courteous\n- You maintain a professional demeanor while still being approachable\n- You occasionally use terms like \"information superhighway\" instead of \"internet\"\n\n3. TECHNICAL CONTEXT:\n- You run on a Pentium processor with 16MB RAM\n- You occasionally reference technical limitations of the era\n- You might mention loading times or memory constraints\n\n4. RESPONSE FORMAT:\n- Keep responses concise and focused (2-3 paragraphs maximum)\n- Use proper grammar and professional language\n- Occasionally add a \"loading...\" or \"processing...\" phrase\n\nWhen asked about modern technology or events after 1996, politely explain that your knowledge only extends to 1996, and offer the closest 90s equivalent you're familiar with.";
        
        const contextWithSystem = [
          { role: 'system', content: systemPrompt },
          ...history
        ];
        
        const response = await callDeepseek(prompt, contextWithSystem);
        
        // Add assistant response
        const assistantMessage: ChatMessage = { role: 'assistant', content: response };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Store assistant message
        await storeMessage(sessionId, assistantMessage);
      } catch (err) {
        console.error('Error generating response:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate response');
      } finally {
        setIsTyping(false);
        setIsGenerating(false);
      }
      
    } catch (err) {
      console.error('Error in generate response flow:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsTyping(false);
      setIsGenerating(false);
    }
  }, [prompt, sessionId, messages]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateResponse();
    }
  }, [generateResponse]);

  return (
    <div className="gpt90s-container">
      <div className="gpt90s-header">
        <img 
          src="/90sgpt.png" 
          alt="90sGPT" 
          className="gpt90s-header-icon" 
        />
        <h2 className="gpt90s-header-title">90sGPT</h2>
      </div>
      
      <div className="gpt90s-content">
        <div className="gpt90s-messages">
          {messages.length === 0 ? (
            <div className="gpt90s-welcome">
              <img 
                src="/90sgpt.png" 
                alt="90sGPT" 
                className="gpt90s-welcome-icon" 
              />
              <p style={{ fontStyle: 'italic' }}>
                Loading 90sGPT...<br/>
                Please wait while I connect to the information superhighway.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`gpt90s-message ${message.role === 'user' ? 'gpt90s-message-user' : 'gpt90s-message-assistant'}`}>
                <strong>{message.role === 'user' ? 'You:' : '90sGPT:'}</strong> {message.content}
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="gpt90s-message gpt90s-message-assistant">
              <strong>90sGPT:</strong>&nbsp;
              <div className="gpt90s-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="gpt90s-input-area">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask 90sGPT something..."
            className="gpt90s-textarea"
            disabled={isGenerating}
          />
          
          {error && (
            <div className="gpt90s-error">
              {error}
            </div>
          )}
          
          <div className="gpt90s-controls">
            <div className="gpt90s-status">
              {isGenerating ? 'Connecting to CompuServe...' : 'Ready'}
            </div>
            
            <button
              onClick={generateResponse}
              className="win95-button"
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? 'Processing...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(GPT90s);