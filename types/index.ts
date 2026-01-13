// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  preferences: UserPreferences;
  created_at: string;
}

export interface UserPreferences {
  dietary_restrictions?: string[];
  favorite_cuisines?: string[];
  cooking_skill?: 'beginner' | 'intermediate' | 'advanced';
}

// Calendar types
export interface CalendarEvent {
  id: string;
  google_event_id: string | null;
  title: string;
  start_time: string;
  end_time: string;
  is_movable: boolean;
  user_id: string;
  synced_at: string;
}

export type AvailabilityStatus = 'green' | 'amber' | 'red';

export interface DayAvailability {
  date: string;
  status: AvailabilityStatus;
  events: CalendarEvent[];
  conflicts: string[];
}

// Meal types
export interface Meal {
  id: string;
  name: string;
  description: string | null;
  prep_time_mins: number | null;
  tags: string[];
  is_favourite: boolean;
  created_by: string;
  created_at: string;
}

export interface MealPlan {
  id: string;
  date: string;
  meal_id: string;
  meal?: Meal;
  cook_id: string;
  cook?: User;
  created_at: string;
}

export interface DinnerPoll {
  id: string;
  date: string;
  user_id: string;
  user?: User;
  is_home: boolean;
  responded_at: string;
}

export interface MealSuggestion {
  name: string;
  reason: string;
  prepTime: string;
  tags: string[];
}

// Task types
export type TaskCategory = 'home' | 'kids' | 'admin' | 'projects';
export type RecurrenceRule = 'daily' | 'weekly' | 'fortnightly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  category: TaskCategory;
  assigned_to: string | null;
  assignee?: User;
  created_by: string;
  creator?: User;
  is_recurring: boolean;
  recurrence_rule: RecurrenceRule | null;
  next_due: string | null;
  completed_at: string | null;
  created_at: string;
}

// Feedback types
export type EntityType = 'meal_suggestion' | 'task' | 'calendar';

export interface Feedback {
  id: string;
  entity_type: EntityType;
  entity_id: string | null;
  user_id: string;
  rating: -1 | 0 | 1;
  comment: string | null;
  context: Record<string, unknown>;
  created_at: string;
}

// Learned preferences
export interface LearnedPreference {
  id: string;
  user_id: string;
  preference_type: string;
  preference_key: string;
  preference_value: Record<string, unknown>;
  confidence: number;
  updated_at: string;
}

// Agent types
export interface AgentContext {
  userId: string;
  familyId?: string;
  date?: string;
}

export interface AgentResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Family members (hardcoded for MVP)
export const FAMILY_MEMBERS = {
  TROY: { name: 'Troy', role: 'admin' as const },
  LEX: { name: 'Lex', role: 'admin' as const },
  LUKE: { name: 'Luke', role: 'member' as const },
  CHARLIE: { name: 'Charlie', role: 'member' as const },
} as const;

// Dietary restrictions (from user input - to be filled in)
export const DIETARY_RESTRICTIONS: string[] = [];
