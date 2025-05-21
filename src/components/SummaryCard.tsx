
import React from 'react';
import { type Message } from '../utils/chatLogic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SummaryCardProps {
  message: Message;
  onRestart: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ message, onRestart }) => {
  if (!message.careers || message.careers.length === 0) {
    return null;
  }
  
  return (
    <div className="flex mb-4 animate-fade-in w-full">
      <div className="w-10 h-10 rounded-full bg-chatbot-blue text-white flex items-center justify-center">
        <span className="text-lg font-semibold">CG</span>
      </div>
      <div className="ml-3 max-w-[90%] w-full">
        <Card className="w-full border-l-4 border-l-chatbot-blue shadow-md animate-slide-in">
          <CardHeader>
            <CardTitle className="text-chatbot-blue">Career Guidance Summary</CardTitle>
            <CardDescription>Based on your responses, here are your personalized career recommendations</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Your Profile:</h3>
              <div className="bg-chatbot-cream rounded-md p-3 mt-2">
                <p className="text-sm"><strong>Strongest subjects:</strong> {message.subjects?.join(', ')}</p>
                <p className="text-sm"><strong>Personal interests:</strong> {message.interests?.join(', ')}</p>
                <p className="text-sm"><strong>Preferred working style:</strong> {message.workingStyles?.join(', ')}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">Recommended Careers:</h3>
              <div className="space-y-2 mt-2">
                {message.careers.map((career, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-md p-3">
                    <p className="font-medium text-chatbot-blue">{index + 1}. {career.name}</p>
                    <p className="text-sm text-gray-600">• Subject combination: {career.subjectCombination}</p>
                    <p className="text-sm text-gray-600">• Education: {career.educationPathway}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-chatbot-lightBlue rounded-md p-3">
              <p className="text-sm">For detailed information about these careers, speak with your school's career counselor or visit the National Curriculum Development Centre website.</p>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={onRestart}
              className="bg-chatbot-blue hover:bg-blue-800 text-white"
            >
              Start New Session
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SummaryCard;
