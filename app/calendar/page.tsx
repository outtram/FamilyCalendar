'use client';

import { Nav } from '@/components/nav';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

type AvailabilityStatus = 'green' | 'amber' | 'red';

interface DayData {
  date: Date;
  status: AvailabilityStatus;
  events: string[];
}

function getStatusColor(status: AvailabilityStatus) {
  switch (status) {
    case 'green':
      return 'bg-green-500';
    case 'amber':
      return 'bg-amber-500';
    case 'red':
      return 'bg-red-500';
  }
}

function getStatusLabel(status: AvailabilityStatus) {
  switch (status) {
    case 'green':
      return 'Clear - Available for shifts';
    case 'amber':
      return 'Movable conflict';
    case 'red':
      return 'Blocked - Non-movable event';
  }
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Mock data - will be replaced with real calendar sync
  const weekDays: DayData[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    // Random status for demo
    const statuses: AvailabilityStatus[] = ['green', 'green', 'green', 'amber', 'red'];
    return {
      date,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      events: [],
    };
  });

  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />

      <main className="flex-1 p-4 pb-24 md:pb-4">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          </div>
          <p className="text-gray-600">
            Quick view of your week - Green means ready for shifts!
          </p>
        </header>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevWeek}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">
            {format(weekStart, 'd MMM')} - {format(addDays(weekStart, 6), 'd MMM yyyy')}
          </span>
          <button
            onClick={nextWeek}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekDays.map((day) => (
            <div
              key={day.date.toISOString()}
              className={`p-3 rounded-xl border ${
                isSameDay(day.date, new Date())
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="text-center">
                <p className="text-xs text-gray-500">{format(day.date, 'EEE')}</p>
                <p className="text-lg font-semibold">{format(day.date, 'd')}</p>
                <div
                  className={`w-3 h-3 rounded-full mx-auto mt-2 ${getStatusColor(
                    day.status
                  )}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <h2 className="font-semibold mb-3">Legend</h2>
          <div className="space-y-2">
            {(['green', 'amber', 'red'] as AvailabilityStatus[]).map((status) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                <span className="text-sm text-gray-600">{getStatusLabel(status)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Available Days List */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold mb-3">Available Days This Month</h2>
          <p className="text-sm text-gray-600 mb-4">
            Copy this list to send to the hospital for shift availability:
          </p>
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm">
            <p className="text-gray-500">Connect Google Calendar to generate list</p>
          </div>
          <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Connect Google Calendar
          </button>
        </div>
      </main>
    </div>
  );
}
