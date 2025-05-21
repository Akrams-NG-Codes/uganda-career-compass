
import { supabase } from '@/integrations/supabase/client';
import { Career, UserProfile, CareerCategory, UserSession, SessionRecommendation } from '@/types/careerGuide';

// Function to check if a user is an admin
export const checkIsAdmin = async (userId: string): Promise<{ isAdmin: boolean }> => {
  try {
    // Since user_roles table doesn't exist in the schema, we'll use a simpler approach
    // This is a mock implementation - in a real app, you would have a proper user_roles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking admin status:', error);
      return { isAdmin: false };
    }
    
    // For demo purposes - in a real app you would check the actual role value
    // Here we consider the user an admin if they have a profile
    return { isAdmin: data ? true : false };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false };
  }
};

// Function to get careers from Supabase
export const getCareers = async (): Promise<Career[]> => {
  try {
    // Use profiles table as a proxy since 'careers' doesn't exist in the schema yet
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) {
      console.error('Error fetching careers:', error);
      return [];
    }
    
    // Transform the profile data to career structure for demonstration
    const mockCareers: Career[] = data.map((profile, index) => ({
      id: `career-${index}`,
      name: `Sample Career ${index}`,
      description: `Description for career ${index}`,
      subject_combination: "Mathematics, Physics, Chemistry",
      education_pathway: "University Degree",
      average_salary: `$${50000 + index * 10000}`,
      career_category_id: "sample-category",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      matchScore: 85 - (index * 5),
      universities: ["Makerere University", "Kampala University"],
    }));
    
    return mockCareers;
  } catch (error) {
    console.error('Error fetching careers:', error);
    return [];
  }
};

// Function to get career categories
export const getCareerCategories = async (): Promise<CareerCategory[]> => {
  try {
    // Using categories table which exists in the schema
    const { data, error } = await supabase
      .from('categories')
      .select('*');
      
    if (error) {
      console.error('Error fetching career categories:', error);
      return [];
    }
    
    // Transform to career categories
    const mockCategories: CareerCategory[] = data.map((category, index) => ({
      id: category.id || `category-${index}`,
      name: category.name || `Category ${index}`,
      description: `Description for ${category.name || 'Category ' + index}`,
      created_at: category.created_at || new Date().toISOString(),
    }));
    
    return mockCategories;
  } catch (error) {
    console.error('Error fetching career categories:', error);
    return [];
  }
};

// Get user profile by ID
export const getUserProfile = async (userId: string): Promise<{ data: UserProfile | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      return { data: null, error };
    }
    
    // Transform to UserProfile type
    const profile: UserProfile = {
      id: data.id,
      email: data.email || '',
      first_name: data.first_name,
      last_name: data.last_name,
      school: null,
      grade: null,
      created_at: data.created_at,
      updated_at: data.updated_at || data.created_at,
    };
    
    return { data: profile, error: null };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { data: null, error };
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<{ data: UserProfile | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        // We cannot use school and grade as they don't exist in the profiles table
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      return { data: null, error };
    }
    
    // Transform to UserProfile type
    const profile: UserProfile = {
      id: data.id,
      email: data.email || '',
      first_name: data.first_name,
      last_name: data.last_name,
      school: null, // These fields aren't in the actual table
      grade: null,  // These fields aren't in the actual table
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
    
    return { data: profile, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
};

// Function to save user session data (mock implementation)
export const saveUserSession = async (sessionData: Omit<UserSession, 'id' | 'created_at'>): Promise<{ data: UserSession | null, error: any }> => {
  try {
    // Use a mock implementation since user_sessions table doesn't exist in schema
    console.log('Saving user session (mock):', sessionData);
    
    const mockSession: UserSession = {
      id: `session-${Date.now()}`,
      user_id: sessionData.user_id,
      subjects: sessionData.subjects,
      interests: sessionData.interests,
      working_styles: sessionData.working_styles,
      goals: sessionData.goals,
      created_at: new Date().toISOString(),
    };
    
    return { data: mockSession, error: null };
  } catch (error) {
    console.error('Error saving user session:', error);
    return { data: null, error };
  }
};

// Function to save session recommendations (mock implementation)
export const saveSessionRecommendations = async (recommendations: Omit<SessionRecommendation, 'id' | 'created_at'>[]): Promise<{ error: any }> => {
  try {
    // Mock implementation since session_recommendations table doesn't exist
    console.log('Saving recommendations (mock):', recommendations);
    return { error: null };
  } catch (error) {
    console.error('Error saving session recommendations:', error);
    return { error };
  }
};

// Function to get user sessions
export const getUserSessions = async (userId: string): Promise<{ data: UserSession[], error: any }> => {
  try {
    // Mock implementation since user_sessions table doesn't exist in schema
    const mockSessions: UserSession[] = [
      {
        id: 'session-1',
        user_id: userId,
        subjects: ['Mathematics', 'Physics', 'Chemistry'],
        interests: ['Technology', 'Research'],
        working_styles: ['Team-based', 'Problem-solving'],
        goals: 'Career in engineering',
        created_at: new Date().toISOString(),
      },
      {
        id: 'session-2',
        user_id: userId,
        subjects: ['Biology', 'Chemistry', 'Mathematics'],
        interests: ['Healthcare', 'Science'],
        working_styles: ['Detail-oriented', 'Analytical'],
        goals: 'Medical career',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      }
    ];
    
    return { data: mockSessions, error: null };
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return { data: [], error };
  }
};

// Function to get session recommendations
export const getSessionRecommendations = async (sessionId: string): Promise<{ data: any[], error: any }> => {
  try {
    // Mock implementation since session_recommendations table doesn't exist
    const mockRecommendations = [
      {
        id: 'rec-1',
        session_id: sessionId,
        career_id: 'career-1',
        match_score: 95,
        created_at: new Date().toISOString(),
        careers: { name: 'Software Engineer' }
      },
      {
        id: 'rec-2',
        session_id: sessionId,
        career_id: 'career-2',
        match_score: 85,
        created_at: new Date().toISOString(),
        careers: { name: 'Data Scientist' }
      },
      {
        id: 'rec-3',
        session_id: sessionId,
        career_id: 'career-3',
        match_score: 80,
        created_at: new Date().toISOString(),
        careers: { name: 'IT Consultant' }
      }
    ];
    
    return { data: mockRecommendations, error: null };
  } catch (error) {
    console.error('Error getting session recommendations:', error);
    return { data: [], error };
  }
};

// Function to track analytics events
export const trackEvent = async (eventType: string, eventData: Record<string, any>, userId?: string): Promise<void> => {
  try {
    console.log('Tracking event (mock):', { eventType, eventData, userId });
    // In a real implementation, this would save to an analytics table
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Create a career in the database (mock implementation)
export const createCareer = async (careerData: Partial<Career>): Promise<{ data: Career | null, error: any }> => {
  try {
    console.log('Creating career (mock):', careerData);
    
    const mockCareer: Career = {
      id: `career-${Date.now()}`,
      name: careerData.name || 'Unknown career',
      description: careerData.description || '',
      subject_combination: careerData.subject_combination || '',
      education_pathway: careerData.education_pathway || '',
      average_salary: careerData.average_salary || null,
      career_category_id: careerData.career_category_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return { data: mockCareer, error: null };
  } catch (error) {
    console.error('Error creating career:', error);
    return { data: null, error };
  }
};

// Create a career category (mock implementation)
export const createCareerCategory = async (name: string, description: string): Promise<{ data: CareerCategory | null, error: any }> => {
  try {
    console.log('Creating career category (mock):', { name, description });
    
    const mockCategory: CareerCategory = {
      id: `category-${Date.now()}`,
      name,
      description,
      created_at: new Date().toISOString(),
    };
    
    return { data: mockCategory, error: null };
  } catch (error) {
    console.error('Error creating career category:', error);
    return { data: null, error };
  }
};

// Delete a career (mock implementation)
export const deleteCareer = async (careerId: string): Promise<{ error: any }> => {
  try {
    console.log('Deleting career (mock):', careerId);
    return { error: null };
  } catch (error) {
    console.error('Error deleting career:', error);
    return { error };
  }
};
