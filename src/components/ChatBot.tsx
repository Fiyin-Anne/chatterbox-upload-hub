
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatMessage, { MessageType } from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import DocumentUploader from './DocumentUploader';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: 'Hello! I\'m your document assistant. You can chat with me directly or upload a document for more specific assistance.',
      type: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: input.trim(),
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate a bot response
    setTimeout(() => {
      let botResponse: MessageType;

      if (documentUploaded) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `I'm analyzing your document in relation to: "${input.trim()}". In a real implementation, this would use AI to process your question against the uploaded document.`,
          type: 'bot',
          timestamp: new Date(),
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `You asked: "${input.trim()}". For more specific answers, you can also upload a document using the upload button below the chat.`,
          type: 'bot',
          timestamp: new Date(),
        };
      }

      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const handleUpload = (file: File) => {
    // In a real implementation, we'd process the PDF here
    // For now, we'll just acknowledge the upload
    toast({
      title: "Document uploaded successfully",
      description: `We've received your document: ${file.name}`,
    });
    
    setDocumentUploaded(true);
    setShowUploader(false);
    
    // Add a system message acknowledging the document
    const systemMessage: MessageType = {
      id: Date.now().toString(),
      content: `I've received your document: ${file.name}. You can now ask me questions about it!`,
      type: 'bot',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  const toggleUploader = () => {
    setShowUploader(prev => !prev);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Document uploader - shown only when toggle is clicked */}
      {showUploader && (
        <div className="px-4">
          <DocumentUploader onUpload={handleUpload} />
        </div>
      )}

      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={toggleUploader}
            size="icon"
            variant="outline"
            className="flex-shrink-0"
            title="Upload Document"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={input.trim() === ''}
            className="bg-indigo-600 hover:bg-indigo-700 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
