
import { supabase } from '@/integrations/supabase/client';
import { Career, UserProfile, CareerCategory, UserSession, SessionRecommendation } from '@/types/careerGuide';

// Function to check if a user is an admin
export const checkIsAdmin = async (userId: string): Promise<{ isAdmin: boolean }> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin');
    
    if (error) {
      console.error('Error checking admin status:', error);
      return { isAdmin: false };
    }
    
    return { isAdmin: data && data.length > 0 };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false };
  }
};

// Function to get careers from Supabase
export const getCareers = async (): Promise<Career[]> => {
  try {
    // Use generic fetch to avoid type issues with the generated types
    const { data, error } = await supabase
      .from('careers')
      .select('*, career_categories(name)');
      
    if (error) {
      console.error('Error fetching careers:', error);
      return [];
    }
    
    return data as unknown as Career[];
  } catch (error) {
    console.error('Error fetching careers:', error);
    return [];
  }
};

// Function to get career categories from Supabase
export const getCareerCategories = async (): Promise<CareerCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('career_categories')
      .select('*');
      
    if (error) {
      console.error('Error fetching career categories:', error);
      return [];
    }
    
    return data as unknown as CareerCategory[];
  } catch (error) {
    console.error('Error fetching career categories:', error);
    return [];
  }
};

// Function to save user session data
export const saveUserSession = async (sessionData: Omit<UserSession, 'id' | 'created_at'>): Promise<{ data: UserSession | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert(sessionData)
      .select()
      .single();
      
    return { 
      data: data as unknown as UserSession, 
      error 
    };
  } catch (error) {
    console.error('Error saving user session:', error);
    return { data: null, error };
  }
};

// Function to save session recommendations
export const saveSessionRecommendations = async (recommendations: Omit<SessionRecommendation, 'id' | 'created_at'>[]): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('session_recommendations')
      .insert(recommendations);
      
    return { error };
  } catch (error) {
    console.error('Error saving session recommendations:', error);
    return { error };
  }
};

// Function to track analytics events
export const trackEvent = async (eventType: string, eventData: Record<string, any>, userId?: string): Promise<void> => {
  try {
    await supabase
      .from('analytics')
      .insert({
        event_type: eventType,
        event_data: eventData,
        user_id: userId
      });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Create a career in the database (for admin use)
export const createCareer = async (careerData: Partial<Career>): Promise<{ data: Career | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('careers')
      .insert(careerData)
      .select()
      .single();
      
    return { 
      data: data as unknown as Career, 
      error 
    };
  } catch (error) {
    console.error('Error creating career:', error);
    return { data: null, error };
  }
};

// Create a career category (for admin use)
export const createCareerCategory = async (name: string, description: string): Promise<{ data: CareerCategory | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('career_categories')
      .insert({ name, description })
      .select()
      .single();
      
    return { 
      data: data as unknown as CareerCategory, 
      error 
    };
  } catch (error) {
    console.error('Error creating career category:', error);
    return { data: null, error };
  }
};

// Delete a career (for admin use)
export const deleteCareer = async (careerId: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('careers')
      .delete()
      .eq('id', careerId);
      
    return { error };
  } catch (error) {
    console.error('Error deleting career:', error);
    return { error };
  }
};
