
import React from 'react';
import { type Message } from '../utils/chatLogic';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  message: Message;
  selectOption: (option: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, selectOption }) => {
  if (message.type === 'bot') {
    return (
      <div className="flex mb-4 animate-fade-in">
        <div className="w-10 h-10 rounded-full bg-chatbot-blue text-white flex items-center justify-center">
          <span className="text-lg font-semibold">CG</span>
        </div>
        <div className="ml-3 bg-chatbot-lightBlue rounded-lg py-3 px-4 max-w-[80%]">
          <p className="text-gray-800">{message.text}</p>
        </div>
      </div>
    );
  }
  
  if (message.type === 'user') {
    return (
      <div className="flex mb-4 justify-end animate-fade-in">
        <div className="bg-chatbot-orange rounded-lg py-3 px-4 max-w-[80%]">
          <p className="text-white">{message.text}</p>
        </div>
        <div className="w-10 h-10 ml-3 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-lg font-semibold">😊</span>
        </div>
      </div>
    );
  }
  
  if (message.type === 'options') {
    return (
      <div className="flex mb-4 animate-fade-in">
        <div className="w-10 h-10 rounded-full bg-chatbot-blue text-white flex items-center justify-center">
          <span className="text-lg font-semibold">CG</span>
        </div>
        <div className="ml-3 bg-chatbot-lightBlue rounded-lg py-3 px-4 max-w-[90%]">
          <p className="text-gray-800 mb-3">{message.text}</p>
          <div className="flex flex-wrap gap-2">
            {message.options?.map((option, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="bg-white border-chatbot-blue text-chatbot-blue hover:bg-chatbot-blue hover:text-white mb-1"
                onClick={() => selectOption(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default ChatMessage;
