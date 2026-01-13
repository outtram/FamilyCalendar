import { NextRequest, NextResponse } from 'next/server';
import { suggestMeal, suggestWeeklyMeals } from '@/agents/meal-agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, dates, whoIsHome, recentMeals = [], preferences = {} } = body;

    if (dates && Array.isArray(dates)) {
      // Weekly suggestions
      const suggestions = await suggestWeeklyMeals({
        dates,
        whoIsHome: whoIsHome || ['Troy', 'Lex', 'Luke', 'Charlie'],
        recentMeals,
        preferences,
      });

      return NextResponse.json({ suggestions });
    }

    // Single day suggestion
    const suggestion = await suggestMeal({
      date: date || new Date().toISOString().split('T')[0],
      whoIsHome: whoIsHome || ['Troy', 'Lex', 'Luke', 'Charlie'],
      recentMeals,
      preferences,
    });

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('Meal suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate meal suggestion' },
      { status: 500 }
    );
  }
}
