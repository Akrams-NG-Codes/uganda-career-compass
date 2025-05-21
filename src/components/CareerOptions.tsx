
import React from 'react';
import { type Message } from '../utils/chatLogic';
import { type Career, getMatchReasons } from '../utils/careerData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CareerOptionsProps {
  message: Message;
}

const CareerOptions: React.FC<CareerOptionsProps> = ({ message }) => {
  if (!message.careers || message.careers.length === 0) {
    return null;
  }
  
  return (
    <div className="flex mb-4 animate-fade-in w-full">
      <div className="w-10 h-10 rounded-full bg-chatbot-blue text-white flex items-center justify-center">
        <span className="text-lg font-semibold">CG</span>
      </div>
      <div className="ml-3 max-w-[90%] w-full">
        <p className="text-gray-800 mb-3 bg-chatbot-lightBlue rounded-lg py-3 px-4">{message.text}</p>
        
        <div className="space-y-4 mt-2 w-full">
          {message.careers.map((career, index) => {
            const matchReason = message.subjects && message.interests && message.workingStyles ? 
              getMatchReasons(career, message.subjects, message.interests, message.workingStyles) : '';
            
            return (
              <Card key={index} className="w-full border-l-4 border-l-chatbot-blue shadow-md animate-slide-in" style={{animationDelay: `${index * 300}ms`}}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-chatbot-blue text-xl">{career.name}</CardTitle>
                  <CardDescription>{career.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-700 mb-3">{matchReason}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-chatbot-cream rounded-md p-2">
                      <p className="text-sm font-medium">Required subjects:</p>
                      <p className="text-sm">{career.subjectCombination}</p>
                    </div>
                    <div className="bg-chatbot-cream rounded-md p-2">
                      <p className="text-sm font-medium">Education pathway:</p>
                      <p className="text-sm">{career.educationPathway}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CareerOptions;
