
import React from 'react';
import ChatBot from '@/components/ChatBot';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Document Chat Assistant</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-3xl mx-auto w-full h-full">
          <div className="h-full bg-white shadow-sm rounded-lg">
            <ChatBot />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center text-gray-500">
            This is a demo chatbot interface. Document processing is simulated.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
