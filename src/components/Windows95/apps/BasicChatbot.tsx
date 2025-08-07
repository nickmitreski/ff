import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { AppContentProps } from '../../../data/appData.tsx';

/**
 * BasicChatbot props interface
 */
interface BasicChatbotProps extends AppContentProps {
  // No additional props needed for this basic version beyond AppContentProps
}

/**
 * Message interface for the chat messages
 */
interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

/**
 * BasicChatbot component provides a simple chatbot interface
 * in the Windows 95 style
 */
const BasicChatbot: React.FC<BasicChatbotProps> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Handles sending a message and getting a response
   */
  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      const newUserMessage = { text: inputText, sender: 'user' as 'user' };
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      setInputText('');

      // Simulate bot response after a short delay
      setTimeout(() => {
        const botResponse = { text: 'Coming Soon!', sender: 'bot' as 'bot' };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      }, 500);
    }
  }, [inputText]);

  /**
   * Handles key press events for the input field
   * @param event - Keyboard event
   */
  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  /**
   * Scrolls to the bottom of the messages container when messages change
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '10px',
      boxSizing: 'border-box',
      backgroundColor: '#f0f0f0',
      border: '2px solid #c0c0c0',
    }}>
      <div 
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          marginBottom: '10px',
          padding: '5px',
          border: '1px solid #a0a0a0',
          backgroundColor: '#fff',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '5px', color: msg.sender === 'user' ? 'blue' : 'green' }}>
            <strong>{msg.sender === 'user' ? 'You:' : 'Bot:'}</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            flexGrow: 1,
            marginRight: '5px',
            padding: '5px',
            border: '1px solid #a0a0a0',
          }}
          placeholder="Type a message..."
        />
        <button 
          onClick={handleSend}
          style={{
            padding: '5px 10px',
            border: '1px solid #a0a0a0',
            backgroundColor: '#e0e0e0',
            cursor: 'pointer',
          }}
        >Send</button>
      </div>
    </div>
  );
};

export default memo(BasicChatbot);