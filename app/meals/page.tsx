'use client';

import { Nav } from '@/components/nav';
import { UtensilsCrossed, Sparkles, Heart, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';

interface MealPlanDay {
  date: Date;
  meal: string | null;
  cook: string | null;
}

export default function MealsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Mock data - will be replaced with real data
  const weekPlan: MealPlanDay[] = Array.from({ length: 7 }, (_, i) => ({
    date: addDays(weekStart, i),
    meal: null,
    cook: null,
  }));

  const favouriteMeals = [
    { name: 'Spaghetti Bolognese', tags: ['quick', 'family-favourite'] },
    { name: 'Chicken Stir Fry', tags: ['healthy', 'high-protein'] },
    { name: 'Tacos', tags: ['fun', 'customisable'] },
    { name: 'Roast Chicken', tags: ['sunday', 'leftovers'] },
  ];

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    // TODO: Call meal agent API
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />

      <main className="flex-1 p-4 pb-24 md:pb-4">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <UtensilsCrossed className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Meals</h1>
          </div>
          <p className="text-gray-600">Plan your week and never wonder &quot;what&apos;s for dinner?&quot;</p>
        </header>

        {/* Dinner Poll Link */}
        <Link
          href="/meals/poll"
          className="block bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-blue-900">Who&apos;s home tonight?</h2>
              <p className="text-sm text-blue-700">Let the family know if you&apos;ll be there for dinner</p>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-600" />
          </div>
        </Link>

        {/* AI Suggestions */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold">AI Meal Suggestions</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Get balanced meal ideas for 2 active young men + 2 health-conscious adults
          </p>
          <button
            onClick={handleGenerateSuggestions}
            disabled={isGenerating}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Suggest This Week&apos;s Meals
              </>
            )}
          </button>
        </div>

        {/* Weekly Plan */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <h2 className="font-semibold mb-3">This Week&apos;s Plan</h2>
          <div className="space-y-2">
            {weekPlan.map((day) => (
              <div
                key={day.date.toISOString()}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-medium">{format(day.date, 'EEEE')}</p>
                  <p className="text-sm text-gray-500">{format(day.date, 'd MMM')}</p>
                </div>
                <div className="text-right">
                  {day.meal ? (
                    <>
                      <p className="font-medium">{day.meal}</p>
                      <p className="text-sm text-gray-500">Cook: {day.cook}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">No meal planned</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favourite Meals */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold">Family Favourites</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {favouriteMeals.map((meal) => (
              <button
                key={meal.name}
                className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <p className="font-medium text-sm">{meal.name}</p>
                <div className="flex gap-1 mt-1">
                  {meal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <button className="mt-3 w-full py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg text-sm hover:border-gray-400 hover:text-gray-600 transition-colors">
            + Add favourite meal
          </button>
        </div>
      </main>
    </div>
  );
}
