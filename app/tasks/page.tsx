'use client';

import { Nav } from '@/components/nav';
import { CheckSquare, Plus, Filter, BarChart3 } from 'lucide-react';
import { useState } from 'react';

type TaskCategory = 'home' | 'kids' | 'admin' | 'projects';

interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  assignedTo: string;
  dueDate: string | null;
  isRecurring: boolean;
  completed: boolean;
}

const categoryColors: Record<TaskCategory, string> = {
  home: 'bg-green-100 text-green-800',
  kids: 'bg-blue-100 text-blue-800',
  admin: 'bg-purple-100 text-purple-800',
  projects: 'bg-orange-100 text-orange-800',
};

const categoryLabels: Record<TaskCategory, string> = {
  home: 'Home',
  kids: 'Kids',
  admin: 'Admin',
  projects: 'Projects',
};

export default function TasksPage() {
  const [filter, setFilter] = useState<TaskCategory | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  // Mock data - will be replaced with real data
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Mow the lawn', category: 'home', assignedTo: 'Luke', dueDate: 'Saturday', isRecurring: true, completed: false },
    { id: '2', title: 'Vacuum downstairs', category: 'home', assignedTo: 'Charlie', dueDate: 'Sunday', isRecurring: true, completed: false },
    { id: '3', title: 'Pay electricity bill', category: 'admin', assignedTo: 'Troy', dueDate: 'Tomorrow', isRecurring: false, completed: false },
    { id: '4', title: 'Book dentist appointment', category: 'kids', assignedTo: 'Lex', dueDate: null, isRecurring: false, completed: false },
    { id: '5', title: 'Clean gutters', category: 'projects', assignedTo: 'Troy', dueDate: 'Next week', isRecurring: false, completed: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter !== 'all' && t.category !== filter) return false;
    if (!showCompleted && t.completed) return false;
    return true;
  });

  // Mental load calculation
  const loadByPerson = tasks.reduce((acc, task) => {
    if (!task.completed) {
      acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const maxLoad = Math.max(...Object.values(loadByPerson), 1);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />

      <main className="flex-1 p-4 pb-24 md:pb-4">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          </div>
          <p className="text-gray-600">Keep track of chores and to-dos</p>
        </header>

        {/* Mental Load Dashboard */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold">Mental Load Distribution</h2>
          </div>
          <div className="space-y-2">
            {Object.entries(loadByPerson).map(([person, count]) => (
              <div key={person} className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium">{person}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(count / maxLoad) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {(['all', 'home', 'kids', 'admin', 'projects'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'All' : categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Tasks ({filteredTasks.length})</h2>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="rounded"
              />
              Show completed
            </label>
          </div>

          {filteredTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks to show</p>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    task.completed ? 'bg-gray-50 opacity-60' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {task.completed && <CheckSquare className="w-3 h-3" />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[task.category]}`}>
                        {categoryLabels[task.category]}
                      </span>
                      <span className="text-xs text-gray-500">{task.assignedTo}</span>
                      {task.dueDate && (
                        <span className="text-xs text-gray-500">• {task.dueDate}</span>
                      )}
                      {task.isRecurring && (
                        <span className="text-xs text-blue-600">↻ Recurring</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="mt-4 w-full py-3 border border-dashed border-gray-300 text-gray-500 rounded-lg flex items-center justify-center gap-2 hover:border-gray-400 hover:text-gray-600 transition-colors">
            <Plus className="w-4 h-4" />
            Add new task
          </button>
        </div>
      </main>
    </div>
  );
}
