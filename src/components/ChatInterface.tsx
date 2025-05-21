import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../utils/chatLogic';
import ChatMessage from './ChatMessage';
import CareerOptions from './CareerOptions';
import SummaryCard from './SummaryCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, AlertCircle, RefreshCw } from 'lucide-react';
import { trackEvent, saveUserSession, saveSessionRecommendations } from '@/services/supabaseService';
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from '@/types/careerGuide';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
  retryCount?: number;
}

const ChatInterface: React.FC = () => {
  const { user, profile } = useAuth();
  const { state, sendMessage, selectOption, dispatch } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [retryingMessage, setRetryingMessage] = useState<string | null>(null);
  
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
  
  const handleRetry = async (messageId: string) => {
    const messageToRetry = state.messages.find(m => m.id === messageId);
    if (!messageToRetry || messageToRetry.role !== "user") return;

    setRetryingMessage(messageId);
    try {
      // Remove the failed message and its response
      const newMessages = state.messages.filter(m => m.id !== messageId && m.id !== `${messageId}-response`);
      dispatch({ type: 'SET_MESSAGES', payload: newMessages });
      
      // Resend the message
      await handleSendMessage(messageToRetry.content);
    } catch (error) {
      console.error("Error retrying message:", error);
      toast({
        title: "Error",
        description: "Failed to retry message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRetryingMessage(null);
    }
  };
  
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    setInput('');

    try {
      await trackEvent('user_message', { content: content }, state.user?.id);
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...state.messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `${userMessage.id}-response`,
        role: "assistant",
        content: data.message,
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: `${userMessage.id}-error`,
        role: "assistant",
        content: "Sorry, I encountered an error while processing your message. Please try again.",
        error: true,
      };

      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
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
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-chatbot-blue text-white"
                        : message.error
                        ? "bg-red-50 border border-red-200"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    {message.error && (
                      <div className="flex items-center gap-2 mb-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Error</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.error && message.role === "assistant" && (
                      <button
                        onClick={() => handleRetry(message.id.split("-")[0])}
                        disabled={retryingMessage === message.id.split("-")[0]}
                        className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3 w-3 ${retryingMessage === message.id.split("-")[0] ? "animate-spin" : ""}`} />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
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
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex gap-2">
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
