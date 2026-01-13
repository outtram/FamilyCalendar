import { Nav } from '@/components/nav';
import { Calendar, UtensilsCrossed, CheckSquare, Users } from 'lucide-react';
import Link from 'next/link';

function QuickCard({
  title,
  icon: Icon,
  href,
  status,
  statusColor,
  children,
}: {
  title: string;
  icon: React.ElementType;
  href: string;
  status?: string;
  statusColor?: 'green' | 'amber' | 'red' | 'blue';
  children: React.ReactNode;
}) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
  };

  return (
    <Link
      href={href}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">{title}</h2>
        </div>
        {status && statusColor && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${colorClasses[statusColor]}`}
          >
            {status}
          </span>
        )}
      </div>
      <div className="text-sm text-gray-600">{children}</div>
    </Link>
  );
}

function DinnerPollWidget() {
  const familyMembers = ['Troy', 'Lex', 'Luke', 'Charlie'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-5 h-5 text-gray-600" />
        <h2 className="font-semibold text-gray-900">Who&apos;s home tonight?</h2>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {familyMembers.map((member) => (
          <button
            key={member}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <span className="text-sm font-medium">{member}</span>
            <span className="text-gray-400">?</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        Tap to respond (requires login)
      </p>
    </div>
  );
}

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />

      <main className="flex-1 p-4 pb-24 md:pb-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Family Command Centre</h1>
          <p className="text-gray-600">{today}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <QuickCard
            title="Today's Schedule"
            icon={Calendar}
            href="/calendar"
            status="Clear"
            statusColor="green"
          >
            <p>No conflicts today. Ready for shift pickups!</p>
            <p className="mt-2 text-xs text-gray-500">
              Connect Google Calendar to see events
            </p>
          </QuickCard>

          <QuickCard
            title="Tonight's Dinner"
            icon={UtensilsCrossed}
            href="/meals"
            status="Not planned"
            statusColor="amber"
          >
            <p>No meal planned yet</p>
            <p className="mt-2 text-xs text-gray-500">
              Get AI suggestions based on who&apos;s home
            </p>
          </QuickCard>

          <QuickCard
            title="Tasks Due"
            icon={CheckSquare}
            href="/tasks"
            status="0 due"
            statusColor="blue"
          >
            <p>No tasks due today</p>
            <p className="mt-2 text-xs text-gray-500">
              Add recurring chores to get started
            </p>
          </QuickCard>

          <DinnerPollWidget />
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/calendar"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Check Availability
            </Link>
            <Link
              href="/meals"
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Plan This Week&apos;s Meals
            </Link>
            <Link
              href="/tasks"
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              View All Tasks
            </Link>
          </div>
        </section>

        <footer className="mt-12 text-center text-xs text-gray-400">
          <p>Family Command Centre v0.1</p>
          <p className="mt-1">Built with Next.js + Supabase + Claude</p>
        </footer>
      </main>
    </div>
  );
}
