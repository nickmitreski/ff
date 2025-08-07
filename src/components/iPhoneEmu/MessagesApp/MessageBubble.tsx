import React from 'react';

interface MessageBubbleProps {
  sender: string;
  text: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text }) => {
  const isUser = sender === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs px-4 py-2 skeuo-bubble ${
          isUser
            ? "skeuo-bubble-outgoing"
            : "skeuo-bubble-incoming"
        }`}
      >
        <p className="text-sm leading-relaxed font-helvetica skeuo-bubble-text">{text}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
