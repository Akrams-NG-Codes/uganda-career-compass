
import React from 'react';
import ChatInterface from '../components/ChatInterface';
import { GraduationCap, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, isLoading } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-chatbot-blue mr-2" />
            <h1 className="text-2xl md:text-3xl font-bold text-chatbot-blue">Career Guide AI</h1>
          </div>
          
          <div>
            {isLoading ? (
              <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>Profile</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </header>
        
        <p className="text-center text-gray-600 mb-6">
          Helping Ugandan secondary school students discover their ideal career paths
        </p>
        
        <div className="flex-1">
          <ChatInterface />
        </div>
        
        <footer className="text-center text-sm text-gray-500 mt-6 flex justify-between items-center">
          <p>© 2025 Career Guide AI - Supporting education in Uganda</p>
          {user && (
            <Link to="/admin" className="flex items-center text-gray-500 hover:text-chatbot-blue">
              <Settings className="h-4 w-4 mr-1" />
              <span>Admin</span>
            </Link>
          )}
        </footer>
      </div>
    </div>
  );
};

export default Index;
