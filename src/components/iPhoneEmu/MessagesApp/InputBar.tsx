import React from 'react';

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ value, onChange, onSend, disabled }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled && value.trim()) {
      onSend();
    }
  };

  const handleSend = () => {
    if (!disabled && value.trim()) {
      onSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="iMessage"
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled}
          autoFocus
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            disabled || !value.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default InputBar;
