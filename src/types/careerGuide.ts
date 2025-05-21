
// Custom types for the Career Guide application
// These complement the auto-generated Supabase types

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  school?: string | null;
  grade?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Career {
  id: string;
  name: string;
  description: string;
  subjectCombination: string; // Changed from subject_combination for frontend
  educationPathway: string;   // Changed from education_pathway for frontend
  average_salary?: string | null;
  career_category_id?: string | null;
  created_at: string;
  updated_at: string;
  matchScore?: number; // Used for matching in the chat interface
  universities?: string[]; // Used for university recommendations
}

export interface CareerCategory {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
}

export interface University {
  id: string;
  name: string;
  website?: string | null;
  location?: string | null;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  subjects: string[];
  interests: string[];
  working_styles: string[];
  goals?: string | null;
  created_at: string;
}

export interface SessionRecommendation {
  id: string;
  session_id: string;
  career_id: string;
  match_score: number;
  created_at: string;
}

export type UserRole = 'admin' | 'user';

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  event_data: Record<string, any>;
  user_id?: string | null;
  created_at: string;
}
