import { chatJSON } from '@/lib/claude';
import type { MealSuggestion } from '@/types';

interface MealContext {
  date: string;
  whoIsHome: string[];
  recentMeals: string[];
  preferences: Record<string, string[]>;
  dietaryRestrictions?: string[];
}

const SYSTEM_PROMPT = `You are a family meal planning assistant for the Outtram family in Melbourne, Australia:

Family members:
- Troy and Lex: health-conscious adults, prefer balanced meals
- Luke (21) and Charlie (17): active young men, need high protein and good portions

Guidelines:
- Keep suggestions practical for weeknight cooking (under 45 mins ideal)
- Vary suggestions - avoid repeating recent meals
- Consider who's home and their cooking ability
- Balance nutrition: good protein, vegetables, complex carbs
- Mix cuisines: Australian, Asian, Italian, Mexican, etc.
- Account for any dietary restrictions provided

Always respond with valid JSON only, no markdown.`;

export async function suggestMeal(context: MealContext): Promise<MealSuggestion> {
  const userPrompt = `Suggest a dinner for ${context.date}.

Who's home: ${context.whoIsHome.join(', ')}
Recent meals (avoid these): ${context.recentMeals.join(', ') || 'None provided'}
Known preferences: ${JSON.stringify(context.preferences)}
${context.dietaryRestrictions?.length ? `Dietary restrictions: ${context.dietaryRestrictions.join(', ')}` : ''}

Respond with JSON: { "name": "meal name", "reason": "why this meal", "prepTime": "X mins", "tags": ["tag1", "tag2"] }`;

  return chatJSON<MealSuggestion>(SYSTEM_PROMPT, userPrompt, 500);
}

export async function suggestWeeklyMeals(
  context: Omit<MealContext, 'date'> & { dates: string[] }
): Promise<MealSuggestion[]> {
  const userPrompt = `Suggest dinners for the week: ${context.dates.join(', ')}

Who's typically home: ${context.whoIsHome.join(', ')}
Recent meals (avoid these): ${context.recentMeals.join(', ') || 'None provided'}
Known preferences: ${JSON.stringify(context.preferences)}
${context.dietaryRestrictions?.length ? `Dietary restrictions: ${context.dietaryRestrictions.join(', ')}` : ''}

Requirements:
- Variety across the week
- Mix of quick meals (Mon-Thu) and more elaborate options (weekend)
- Balance of cuisines
- Good nutrition throughout

Respond with JSON array: [{ "name": "", "reason": "", "prepTime": "", "tags": [] }, ...]`;

  return chatJSON<MealSuggestion[]>(SYSTEM_PROMPT, userPrompt, 2000);
}

// Tool definitions for agent orchestration
export const mealAgentTools = [
  {
    name: 'suggest_meal',
    description: 'Suggest a meal for a specific date based on who is home and preferences',
    input_schema: {
      type: 'object' as const,
      properties: {
        date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
        whoIsHome: { type: 'array', items: { type: 'string' } },
      },
      required: ['date', 'whoIsHome'],
    },
  },
  {
    name: 'suggest_weekly_meals',
    description: 'Suggest meals for an entire week',
    input_schema: {
      type: 'object' as const,
      properties: {
        startDate: { type: 'string', description: 'Start date in YYYY-MM-DD format' },
      },
      required: ['startDate'],
    },
  },
  {
    name: 'record_meal_feedback',
    description: 'Record whether family liked or disliked a meal',
    input_schema: {
      type: 'object' as const,
      properties: {
        mealName: { type: 'string' },
        rating: { type: 'number', description: '-1 (disliked), 0 (neutral), 1 (liked)' },
        userId: { type: 'string' },
      },
      required: ['mealName', 'rating', 'userId'],
    },
  },
];
