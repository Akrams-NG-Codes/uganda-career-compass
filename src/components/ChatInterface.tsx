
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../utils/chatLogic';
import ChatMessage from './ChatMessage';
import CareerOptions from './CareerOptions';
import SummaryCard from './SummaryCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const { state, sendMessage, selectOption, dispatch } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage(input);
    setInput('');
  };
  
  const handleRestart = () => {
    dispatch({ type: 'RESTART_CONVERSATION' });
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-chatbot-blue p-4 text-white">
        <h2 className="text-xl font-semibold">Uganda Career Guide</h2>
        <p className="text-sm opacity-90">AI career guidance for secondary school students</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-chatbot-gray">
        <div className="space-y-4">
          {state.messages.map((message) => {
            if (message.type === 'careers') {
              return <CareerOptions key={message.id} message={message} />;
            } else if (message.type === 'summary') {
              return <SummaryCard key={message.id} message={message} onRestart={handleRestart} />;
            } else {
              return (
                <ChatMessage 
                  key={message.id}
                  message={message}
                  selectOption={selectOption}
                />
              );
            }
          })}
          
          {state.isTyping && (
            <div className="flex animate-pulse">
              <div className="w-10 h-10 rounded-full bg-chatbot-blue text-white flex items-center justify-center">
                <span className="text-lg font-semibold">CG</span>
              </div>
              <div className="ml-3 bg-chatbot-lightBlue rounded-lg py-3 px-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={state.conversationEnded}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || state.conversationEnded}
            className="bg-chatbot-orange hover:bg-orange-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        {state.conversationEnded && (
          <Button 
            onClick={handleRestart}
            variant="outline" 
            className="mt-2 w-full border-chatbot-blue text-chatbot-blue hover:bg-chatbot-blue hover:text-white"
          >
            Start New Session
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
