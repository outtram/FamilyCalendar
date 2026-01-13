'use client';

import { Nav } from '@/components/nav';
import { Users, Check, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { format } from 'date-fns';

interface FamilyMember {
  id: string;
  name: string;
  response: boolean | null;
}

export default function DinnerPollPage() {
  const today = new Date();

  const [members, setMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'Troy', response: null },
    { id: '2', name: 'Lex', response: null },
    { id: '3', name: 'Luke', response: null },
    { id: '4', name: 'Charlie', response: null },
  ]);

  const handleResponse = (memberId: string, isHome: boolean) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, response: isHome } : m))
    );
    // TODO: Save to database
  };

  const homeCount = members.filter((m) => m.response === true).length;
  const awayCount = members.filter((m) => m.response === false).length;
  const pendingCount = members.filter((m) => m.response === null).length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />

      <main className="flex-1 p-4 pb-24 md:pb-4">
        <Link
          href="/meals"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Meals
        </Link>

        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Dinner Poll</h1>
          </div>
          <p className="text-gray-600">
            {format(today, 'EEEE, d MMMM yyyy')}
          </p>
        </header>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{homeCount}</p>
            <p className="text-sm text-green-600">Home</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-700">{awayCount}</p>
            <p className="text-sm text-red-600">Away</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-700">{pendingCount}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </div>

        {/* Family Members */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <h2 className="font-semibold mb-4">Who&apos;s home for dinner tonight?</h2>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-semibold text-blue-600">
                      {member.name[0]}
                    </span>
                  </div>
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResponse(member.id, true)}
                    className={`p-2 rounded-lg transition-colors ${
                      member.response === true
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-green-100 hover:text-green-600'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleResponse(member.id, false)}
                    className={`p-2 rounded-lg transition-colors ${
                      member.response === false
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Message */}
        {homeCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-800">
              <strong>{homeCount} {homeCount === 1 ? 'person' : 'people'}</strong> home for dinner.
              {homeCount >= 3 && ' Time to cook something substantial!'}
              {homeCount === 2 && ' A nice dinner for two?'}
              {homeCount === 1 && ' Solo dinner night!'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
