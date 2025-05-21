import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../utils/chatLogic';
import ChatMessage from './ChatMessage';
import CareerOptions from './CareerOptions';
import SummaryCard from './SummaryCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { trackEvent, saveUserSession, saveSessionRecommendations } from '@/services/supabaseService';
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from '@/types/careerGuide';

const ChatInterface: React.FC = () => {
  const { user, profile } = useAuth();
  const { state, sendMessage, selectOption, dispatch } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Set current user in chat state
  useEffect(() => {
    if (profile) {
      // Use profile instead of user to match UserProfile type
      dispatch({ type: 'SET_USER', payload: profile });
    }
  }, [profile, dispatch]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);
  
  // Track session progress
  useEffect(() => {
    if (state.conversationEnded && state.user?.id) {
      const saveSession = async () => {
        try {
          // Save user session
          const sessionData = {
            user_id: state.user.id,
            subjects: state.subjects || [],
            interests: state.interests || [],
            working_styles: state.workingStyles || [],
            goals: state.goals || ""
          };
          
          const { data: session, error: sessionError } = await saveUserSession(sessionData);
          
          if (sessionError) {
            console.error("Error saving session:", sessionError);
            toast({
              title: "Session Not Saved",
              description: "Failed to save your career guidance session. Please try again later.",
              variant: "destructive",
            });
            return;
          }
          
          if (session && state.recommendedCareers && state.recommendedCareers.length > 0) {
            try {
              // Save career recommendations
              const recommendations = state.recommendedCareers.map(career => ({
                session_id: session.id,
                career_id: career.id || "",
                match_score: career.matchScore || 0
              }));
              
              const { error: recommendationsError } = await saveSessionRecommendations(recommendations);
              
              if (recommendationsError) {
                console.error("Error saving recommendations:", recommendationsError);
                toast({
                  title: "Recommendations Not Saved",
                  description: "Failed to save your career recommendations. Please try again later.",
                  variant: "destructive",
                });
              }
            } catch (error) {
              console.error("Error saving recommendations:", error);
              toast({
                title: "Recommendations Not Saved",
                description: "An unexpected error occurred while saving your recommendations.",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error("Error saving session data:", error);
          toast({
            title: "Session Not Saved",
            description: "An unexpected error occurred while saving your session.",
            variant: "destructive",
          });
        }
      };
      
      saveSession();
    }
  }, [state.conversationEnded, state.user, state.subjects, state.interests, state.workingStyles, state.goals, state.recommendedCareers]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage(input);
    setInput('');
    
    // Track user message for analytics
    try {
      await trackEvent('user_message', { content: input }, state.user?.id);
    } catch (error) {
      console.error("Error tracking event:", error);
    }
  };
  
  const handleRestart = () => {
    dispatch({ type: 'RESTART_CONVERSATION' });
    toast({
      title: "Session Restarted",
      description: "Starting a new career guidance session.",
    });
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
