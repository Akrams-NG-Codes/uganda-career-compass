
import React from 'react';
import ChatInterface from '../components/ChatInterface';
import { Graduation } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
        <header className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <Graduation className="h-8 w-8 text-chatbot-blue mr-2" />
            <h1 className="text-2xl md:text-3xl font-bold text-chatbot-blue">Career Guide AI</h1>
          </div>
          <p className="text-gray-600">Helping Ugandan secondary school students discover their ideal career paths</p>
        </header>
        
        <div className="flex-1">
          <ChatInterface />
        </div>
        
        <footer className="text-center text-sm text-gray-500 mt-6">
          <p>© 2025 Career Guide AI - Supporting education in Uganda</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
