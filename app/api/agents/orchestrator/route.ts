import { NextRequest, NextResponse } from 'next/server';
import {
  orchestrate,
  checkShiftAvailability,
  getDailySummary,
  suggestDinner,
} from '@/agents/orchestrator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, query, userId = 'default', ...params } = body;

    let result;

    switch (action) {
      case 'query':
        result = await orchestrate({ query, userId, context: params.context });
        break;

      case 'check-shift':
        if (!params.date) {
          return NextResponse.json(
            { error: 'Date is required for shift check' },
            { status: 400 }
          );
        }
        result = await checkShiftAvailability(params.date, userId);
        break;

      case 'daily-summary':
        result = await getDailySummary(userId);
        break;

      case 'suggest-dinner':
        result = await suggestDinner(
          params.date || new Date().toISOString().split('T')[0],
          params.whoIsHome || ['Troy', 'Lex', 'Luke', 'Charlie'],
          userId
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: query, check-shift, daily-summary, suggest-dinner' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Orchestrator error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
