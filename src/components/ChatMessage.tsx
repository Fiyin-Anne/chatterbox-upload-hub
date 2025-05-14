
import React from 'react';
import { cn } from "@/lib/utils";

export type MessageType = {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
};

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-2 break-words",
        isUser ? 
          "bg-chat-user text-white rounded-br-none" : 
          "bg-chat-bot text-gray-800 rounded-bl-none"
      )}>
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
