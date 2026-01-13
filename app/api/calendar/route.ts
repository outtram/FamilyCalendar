import { NextRequest, NextResponse } from 'next/server';
import {
  checkDayAvailability,
  generateAvailabilityList,
  checkShiftAvailability,
} from '@/agents/calendar-agent';
import type { CalendarEvent } from '@/types';

// Mock events for development - will be replaced with Google Calendar sync
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    google_event_id: 'mock-1',
    title: 'Team Meeting',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 3600000).toISOString(),
    is_movable: true,
    user_id: 'troy',
    synced_at: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const date = searchParams.get('date');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    switch (action) {
      case 'check-day':
        if (!date) {
          return NextResponse.json(
            { error: 'Date is required' },
            { status: 400 }
          );
        }
        const dayAvailability = await checkDayAvailability(date, mockEvents);
        return NextResponse.json(dayAvailability);

      case 'available-list':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'startDate and endDate are required' },
            { status: 400 }
          );
        }
        const availableDays = await generateAvailabilityList(
          mockEvents,
          startDate,
          endDate
        );
        return NextResponse.json({ availableDays });

      case 'shift-check':
        if (!date) {
          return NextResponse.json(
            { error: 'Date is required' },
            { status: 400 }
          );
        }
        const shiftAvailability = await checkShiftAvailability(date, mockEvents);
        return NextResponse.json(shiftAvailability);

      default:
        // Return all events for date range
        return NextResponse.json({ events: mockEvents });
    }
  } catch (error) {
    console.error('Calendar API error:', error);
    return NextResponse.json(
      { error: 'Failed to process calendar request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'sync') {
      // TODO: Implement Google Calendar sync
      return NextResponse.json({
        message: 'Google Calendar sync not yet implemented',
        status: 'pending',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Calendar sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync calendar' },
      { status: 500 }
    );
  }
}
