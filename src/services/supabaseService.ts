
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Career, CareerCategory, UserSession, SessionRecommendation } from "@/types/careerGuide";

// Auth functions
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

// User profile functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
};

// Career data functions
export const getCareerCategories = async () => {
  const { data, error } = await supabase
    .from('career_categories')
    .select('*');
  
  return { data, error };
};

export const getCareers = async () => {
  const { data, error } = await supabase
    .from('careers')
    .select('*');
  
  return { data, error };
};

export const getCareerById = async (careerId: string) => {
  const { data, error } = await supabase
    .from('careers')
    .select('*')
    .eq('id', careerId)
    .maybeSingle();
  
  return { data, error };
};

// Session functions
export const saveUserSession = async (session: Omit<UserSession, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('user_sessions')
    .insert(session)
    .select()
    .single();
  
  return { data, error };
};

export const getUserSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId);
  
  return { data, error };
};

export const saveSessionRecommendations = async (recommendations: Omit<SessionRecommendation, 'id' | 'created_at'>[]) => {
  const { data, error } = await supabase
    .from('session_recommendations')
    .insert(recommendations)
    .select();
  
  return { data, error };
};

export const getSessionRecommendations = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('session_recommendations')
    .select('*, careers(*)')
    .eq('session_id', sessionId);
  
  return { data, error };
};

// Analytics functions
export const trackEvent = async (eventType: string, eventData: Record<string, any>, userId?: string) => {
  const { error } = await supabase
    .from('analytics')
    .insert({
      event_type: eventType,
      event_data: eventData,
      user_id: userId
    });
  
  return { error };
};

// Admin functions
export const checkIsAdmin = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();
  
  return { isAdmin: !!data, error };
};
