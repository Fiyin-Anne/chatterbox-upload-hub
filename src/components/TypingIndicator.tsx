
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="bg-chat-bot text-gray-800 rounded-2xl rounded-bl-none px-4 py-3">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-typing-dot-1"></div>
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-typing-dot-2"></div>
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-typing-dot-3"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
