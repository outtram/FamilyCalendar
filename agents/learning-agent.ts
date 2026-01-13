import type { Feedback, LearnedPreference } from '@/types';

interface PreferenceUpdate {
  userId: string;
  preferenceType: string;
  preferenceKey: string;
  isPositive: boolean;
}

// Confidence decay rate - preferences become less certain over time
const CONFIDENCE_DECAY = 0.95;
const MIN_CONFIDENCE = 0.1;
const MAX_CONFIDENCE = 0.99;

export function updateConfidence(
  currentConfidence: number,
  isPositive: boolean
): number {
  const adjustment = isPositive ? 0.1 : -0.15;
  const newConfidence = currentConfidence + adjustment;
  return Math.max(MIN_CONFIDENCE, Math.min(MAX_CONFIDENCE, newConfidence));
}

export function shouldIncludeInPrompt(preference: LearnedPreference): boolean {
  return preference.confidence >= 0.6;
}

export function extractMealPreferences(
  feedback: Feedback[]
): Record<string, { likes: string[]; dislikes: string[] }> {
  const preferences: Record<string, { likes: string[]; dislikes: string[] }> = {};

  feedback
    .filter((f) => f.entity_type === 'meal_suggestion')
    .forEach((f) => {
      if (!preferences[f.user_id]) {
        preferences[f.user_id] = { likes: [], dislikes: [] };
      }

      const mealName = (f.context as { mealName?: string })?.mealName;
      if (mealName) {
        if (f.rating === 1) {
          preferences[f.user_id].likes.push(mealName);
        } else if (f.rating === -1) {
          preferences[f.user_id].dislikes.push(mealName);
        }
      }
    });

  return preferences;
}

export function buildMealPromptContext(
  preferences: LearnedPreference[]
): string {
  const relevant = preferences.filter(
    (p) => p.preference_type === 'meal' && shouldIncludeInPrompt(p)
  );

  if (relevant.length === 0) return '';

  const lines: string[] = ['Learned preferences:'];

  relevant.forEach((p) => {
    const value = p.preference_value as { type: string; value: string };
    if (value.type === 'like') {
      lines.push(`- Family likes: ${value.value}`);
    } else if (value.type === 'dislike') {
      lines.push(`- Avoid: ${value.value}`);
    }
  });

  return lines.join('\n');
}

export function identifyPatterns(
  feedback: Feedback[]
): { pattern: string; confidence: number }[] {
  const patterns: { pattern: string; confidence: number }[] = [];

  // Analyze meal timing patterns
  const mealFeedback = feedback.filter((f) => f.entity_type === 'meal_suggestion');

  // Check for day-of-week preferences
  const dayPreferences: Record<string, number[]> = {};
  mealFeedback.forEach((f) => {
    const day = new Date(f.created_at).toLocaleDateString('en-AU', {
      weekday: 'long',
    });
    if (!dayPreferences[day]) dayPreferences[day] = [];
    dayPreferences[day].push(f.rating);
  });

  Object.entries(dayPreferences).forEach(([day, ratings]) => {
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    if (avgRating > 0.5) {
      patterns.push({
        pattern: `Meals suggested on ${day} are well-received`,
        confidence: Math.min(0.9, 0.5 + ratings.length * 0.1),
      });
    }
  });

  return patterns;
}

// API call reduction through caching
interface CachedResponse {
  response: unknown;
  timestamp: number;
  ttlMs: number;
}

const responseCache = new Map<string, CachedResponse>();

export function getCachedResponse<T>(key: string): T | null {
  const cached = responseCache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > cached.ttlMs) {
    responseCache.delete(key);
    return null;
  }

  return cached.response as T;
}

export function setCachedResponse(
  key: string,
  response: unknown,
  ttlMs: number = 3600000 // 1 hour default
): void {
  responseCache.set(key, {
    response,
    timestamp: Date.now(),
    ttlMs,
  });
}

export function generateCacheKey(
  agentType: string,
  params: Record<string, unknown>
): string {
  return `${agentType}:${JSON.stringify(params)}`;
}

// Tool definitions for agent orchestration
export const learningAgentTools = [
  {
    name: 'record_feedback',
    description: 'Record user feedback on a suggestion or action',
    input_schema: {
      type: 'object' as const,
      properties: {
        entityType: {
          type: 'string',
          enum: ['meal_suggestion', 'task', 'calendar'],
        },
        entityId: { type: 'string' },
        userId: { type: 'string' },
        rating: {
          type: 'number',
          description: '-1 (negative), 0 (neutral), 1 (positive)',
        },
        comment: { type: 'string' },
      },
      required: ['entityType', 'userId', 'rating'],
    },
  },
  {
    name: 'get_user_preferences',
    description: 'Get learned preferences for a user',
    input_schema: {
      type: 'object' as const,
      properties: {
        userId: { type: 'string' },
        preferenceType: { type: 'string' },
      },
      required: ['userId'],
    },
  },
  {
    name: 'identify_patterns',
    description: 'Analyze feedback to identify behavioral patterns',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
];
