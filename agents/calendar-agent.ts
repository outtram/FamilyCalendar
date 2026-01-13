import type { CalendarEvent, DayAvailability, AvailabilityStatus } from '@/types';

interface CalendarContext {
  userId: string;
  startDate: string;
  endDate: string;
}

export function determineAvailability(events: CalendarEvent[]): AvailabilityStatus {
  if (events.length === 0) return 'green';

  const hasNonMovable = events.some((e) => !e.is_movable);
  if (hasNonMovable) return 'red';

  return 'amber';
}

export function getConflictDescription(events: CalendarEvent[]): string[] {
  return events.map((e) => {
    const time = new Date(e.start_time).toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
    });
    const movable = e.is_movable ? '(movable)' : '(fixed)';
    return `${time}: ${e.title} ${movable}`;
  });
}

export async function checkDayAvailability(
  date: string,
  events: CalendarEvent[]
): Promise<DayAvailability> {
  const dayEvents = events.filter((e) => {
    const eventDate = new Date(e.start_time).toISOString().split('T')[0];
    return eventDate === date;
  });

  return {
    date,
    status: determineAvailability(dayEvents),
    events: dayEvents,
    conflicts: getConflictDescription(dayEvents),
  };
}

export async function generateAvailabilityList(
  events: CalendarEvent[],
  startDate: string,
  endDate: string
): Promise<string[]> {
  const availableDays: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayEvents = events.filter((e) => {
      const eventDate = new Date(e.start_time).toISOString().split('T')[0];
      return eventDate === dateStr;
    });

    if (determineAvailability(dayEvents) === 'green') {
      availableDays.push(
        d.toLocaleDateString('en-AU', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })
      );
    }
  }

  return availableDays;
}

export async function checkShiftAvailability(
  date: string,
  events: CalendarEvent[]
): Promise<{ available: boolean; reason: string }> {
  const availability = await checkDayAvailability(date, events);

  if (availability.status === 'green') {
    return {
      available: true,
      reason: 'Day is clear - no conflicts',
    };
  }

  if (availability.status === 'amber') {
    return {
      available: true,
      reason: `Available but has movable events: ${availability.conflicts.join(', ')}`,
    };
  }

  return {
    available: false,
    reason: `Blocked by: ${availability.conflicts.join(', ')}`,
  };
}

// Tool definitions for agent orchestration
export const calendarAgentTools = [
  {
    name: 'check_day_availability',
    description: 'Check if a specific day is available for shift work',
    input_schema: {
      type: 'object' as const,
      properties: {
        date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
      },
      required: ['date'],
    },
  },
  {
    name: 'get_available_days',
    description: 'Get a list of available days for a date range (for hospital submission)',
    input_schema: {
      type: 'object' as const,
      properties: {
        startDate: { type: 'string', description: 'Start date in YYYY-MM-DD format' },
        endDate: { type: 'string', description: 'End date in YYYY-MM-DD format' },
      },
      required: ['startDate', 'endDate'],
    },
  },
  {
    name: 'check_shift_availability',
    description: 'Quick yes/no check for SOS shift requests',
    input_schema: {
      type: 'object' as const,
      properties: {
        date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
      },
      required: ['date'],
    },
  },
];
