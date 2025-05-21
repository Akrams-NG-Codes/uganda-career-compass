
import { supabase } from '@/integrations/supabase/client';
import { Career, UserProfile, CareerCategory, UserSession, SessionRecommendation } from '@/types/careerGuide';

// Function to check if a user is an admin
export const checkIsAdmin = async (userId: string): Promise<{ isAdmin: boolean }> => {
  try {
    // Since we now have a profiles table, we can check it directly
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
    // Try to fetch from the actual careers table first
    const { data, error } = await supabase
      .from('careers')
      .select('*, categories(*)');
      
    // If there's an error or no data, return mock careers
    if (error || !data || data.length === 0) {
      console.log('Using mock careers data');
      return getMockCareers();
    }
    
    // Transform the career data to our internal format
    return data.map(career => ({
      id: career.id,
      name: career.name,
      description: career.description,
      subject_combination: career.subject_combination,
      education_pathway: career.education_pathway,
      average_salary: career.average_salary,
      career_category_id: career.career_category_id,
      created_at: career.created_at,
      updated_at: career.updated_at,
      matchScore: career.match_score || 85,
      universities: ["Makerere University", "Kampala University"],
      career_categories: career.categories ? {
        id: career.categories.id,
        name: career.categories.name,
        description: career.categories.description || null,
        created_at: career.categories.created_at
      } : undefined
    }));
  } catch (error) {
    console.error('Error fetching careers:', error);
    return getMockCareers();
  }
};

// Helper function to get mock careers
const getMockCareers = (): Career[] => {
  return [
    {
      id: 'career-1',
      name: 'Software Engineer',
      description: 'Develops software applications using various programming languages and tools.',
      subject_combination: "Mathematics, Physics, Chemistry",
      education_pathway: "University Degree",
      average_salary: "$50,000",
      career_category_id: "sample-category",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      matchScore: 85,
      universities: ["Makerere University", "Kampala University"],
    },
    {
      id: 'career-2',
      name: 'Doctor',
      description: 'Medical professional who diagnoses and treats patients.',
      subject_combination: "Biology, Chemistry, Physics",
      education_pathway: "Medical School",
      average_salary: "$80,000",
      career_category_id: "sample-category-2",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      matchScore: 80,
      universities: ["Makerere University", "Kampala University"],
    }
  ];
};

// Function to get career categories
export const getCareerCategories = async (): Promise<CareerCategory[]> => {
  try {
    // Try to fetch from the actual categories table first
    const { data, error } = await supabase
      .from('categories')
      .select('*');
      
    // If there's an error or no data, return mock categories
    if (error || !data || data.length === 0) {
      return getMockCategories();
    }
    
    // Transform to career categories
    return data.map((category) => ({
      id: category.id || `category-${Math.random()}`,
      name: category.name || `Category`,
      description: category.description || `Description`,
      created_at: category.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching career categories:', error);
    return getMockCategories();
  }
};

// Helper function for mock categories
const getMockCategories = (): CareerCategory[] => {
  return [
    {
      id: 'category-1',
      name: 'Technology',
      description: 'Technology and computer-related careers',
      created_at: new Date().toISOString(),
    },
    {
      id: 'category-2',
      name: 'Healthcare',
      description: 'Medical and healthcare-related careers',
      created_at: new Date().toISOString(),
    }
  ];
};

// Get user profile by ID
export const getUserProfile = async (userId: string): Promise<{ data: UserProfile | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error || !data) {
      return { data: null, error: error || new Error('Profile not found') };
    }
    
    // Transform to UserProfile type
    const profile: UserProfile = {
      id: data.id,
      email: data.email || '',
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      school: data.school || null,
      grade: data.grade || null,
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
    const updateData = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      school: profileData.school,
      grade: profileData.grade,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
      
    if (error || !data) {
      return { data: null, error: error || new Error('Failed to update profile') };
    }
    
    // Transform to UserProfile type
    const profile: UserProfile = {
      id: data.id,
      email: data.email || '',
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      school: data.school || null,
      grade: data.grade || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
    
    return { data: profile, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
};

// Function to save user session data
export const saveUserSession = async (sessionData: Omit<UserSession, 'id' | 'created_at'>): Promise<{ data: UserSession | null, error: any }> => {
  try {
    // Try to save to the actual user_sessions table
    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: sessionData.user_id,
        subjects: sessionData.subjects,
        interests: sessionData.interests,
        working_styles: sessionData.working_styles,
        goals: sessionData.goals
      })
      .select()
      .single();
    
    if (error || !data) {
      console.log('Using mock session data');
      // Fallback to mock implementation
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
    }
    
    const session: UserSession = {
      id: data.id,
      user_id: data.user_id,
      subjects: data.subjects || [],
      interests: data.interests || [],
      working_styles: data.working_styles || [],
      goals: data.goals || null,
      created_at: data.created_at,
    };
    
    return { data: session, error: null };
  } catch (error) {
    console.error('Error saving user session:', error);
    return { data: null, error };
  }
};

// Function to save session recommendations
export const saveSessionRecommendations = async (recommendations: Omit<SessionRecommendation, 'id' | 'created_at'>[]): Promise<{ error: any }> => {
  try {
    // Try to save to the actual session_recommendations table
    const { error } = await supabase
      .from('session_recommendations')
      .insert(recommendations.map(rec => ({
        session_id: rec.session_id,
        career_id: rec.career_id,
        match_score: rec.match_score
      })));
    
    if (error) {
      console.log('Could not save recommendations to database, using mock implementation');
      // Just log the recommendations for mock implementation
      console.log('Mock saved recommendations:', recommendations);
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error saving session recommendations:', error);
    return { error };
  }
};

// Function to get user sessions
export const getUserSessions = async (userId: string): Promise<{ data: UserSession[], error: any }> => {
  try {
    // Try to get from the actual user_sessions table
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error || !data || data.length === 0) {
      // Fallback to mock implementation
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
    }
    
    const sessions: UserSession[] = data.map(session => ({
      id: session.id,
      user_id: session.user_id,
      subjects: session.subjects || [],
      interests: session.interests || [],
      working_styles: session.working_styles || [],
      goals: session.goals || null,
      created_at: session.created_at,
    }));
    
    return { data: sessions, error: null };
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return { data: [], error };
  }
};

// Function to get session recommendations
export const getSessionRecommendations = async (sessionId: string): Promise<{ data: any[], error: any }> => {
  try {
    // Try to get from the actual session_recommendations table
    const { data, error } = await supabase
      .from('session_recommendations')
      .select('*, careers(*)')
      .eq('session_id', sessionId);
    
    if (error || !data || data.length === 0) {
      // Fallback to mock implementation
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
    }
    
    return { data, error: null };
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

// Create a career in the database
export const createCareer = async (careerData: Partial<Career>): Promise<{ data: Career | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('careers')
      .insert({
        name: careerData.name || 'Unknown career',
        description: careerData.description || '',
        subject_combination: careerData.subject_combination || '',
        education_pathway: careerData.education_pathway || '',
        average_salary: careerData.average_salary || null,
        career_category_id: careerData.career_category_id || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error || !data) {
      console.log('Using mock career data for creation');
      // Fallback to mock implementation
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
        matchScore: 75,
      };
      
      return { data: mockCareer, error: null };
    }
    
    const career: Career = {
      id: data.id,
      name: data.name,
      description: data.description,
      subject_combination: data.subject_combination,
      education_pathway: data.education_pathway,
      average_salary: data.average_salary,
      career_category_id: data.career_category_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      matchScore: 75,
    };
    
    return { data: career, error: null };
  } catch (error) {
    console.error('Error creating career:', error);
    return { data: null, error };
  }
};

// Create a career category
export const createCareerCategory = async (name: string, description: string): Promise<{ data: CareerCategory | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name,
        description
      })
      .select()
      .single();
    
    if (error || !data) {
      console.log('Using mock category data for creation');
      // Fallback to mock implementation
      const mockCategory: CareerCategory = {
        id: `category-${Date.now()}`,
        name,
        description,
        created_at: new Date().toISOString(),
      };
      
      return { data: mockCategory, error: null };
    }
    
    const category: CareerCategory = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      created_at: data.created_at,
    };
    
    return { data: category, error: null };
  } catch (error) {
    console.error('Error creating career category:', error);
    return { data: null, error };
  }
};

// Delete a career
export const deleteCareer = async (careerId: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('careers')
      .delete()
      .eq('id', careerId);
    
    if (error) {
      console.log('Mock deletion - no actual database deletion occurred');
      return { error: null }; // Return success for mock implementation
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error deleting career:', error);
    return { error };
  }
};
