import type { Task, TaskCategory, RecurrenceRule } from '@/types';
import { addDays, addWeeks, addMonths } from 'date-fns';

interface TaskContext {
  userId: string;
  familyMembers: string[];
}

export function calculateNextDue(
  currentDue: Date,
  rule: RecurrenceRule
): Date {
  switch (rule) {
    case 'daily':
      return addDays(currentDue, 1);
    case 'weekly':
      return addWeeks(currentDue, 1);
    case 'fortnightly':
      return addWeeks(currentDue, 2);
    case 'monthly':
      return addMonths(currentDue, 1);
  }
}

export function getTasksDueToday(tasks: Task[]): Task[] {
  const today = new Date().toISOString().split('T')[0];
  return tasks.filter(
    (t) => !t.completed_at && t.next_due === today
  );
}

export function getTasksDueThisWeek(tasks: Task[]): Task[] {
  const today = new Date();
  const weekEnd = addDays(today, 7);
  const todayStr = today.toISOString().split('T')[0];
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  return tasks.filter(
    (t) =>
      !t.completed_at &&
      t.next_due &&
      t.next_due >= todayStr &&
      t.next_due <= weekEndStr
  );
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  const today = new Date().toISOString().split('T')[0];
  return tasks.filter(
    (t) => !t.completed_at && t.next_due && t.next_due < today
  );
}

export function calculateMentalLoad(tasks: Task[]): Record<string, number> {
  const load: Record<string, number> = {};

  tasks.forEach((task) => {
    if (!task.completed_at && task.assigned_to) {
      load[task.assigned_to] = (load[task.assigned_to] || 0) + 1;
    }
  });

  return load;
}

export function suggestAssignment(
  tasks: Task[],
  familyMembers: string[]
): string {
  const load = calculateMentalLoad(tasks);

  // Find person with lowest load
  let minLoad = Infinity;
  let suggestion = familyMembers[0];

  familyMembers.forEach((member) => {
    const memberLoad = load[member] || 0;
    if (memberLoad < minLoad) {
      minLoad = memberLoad;
      suggestion = member;
    }
  });

  return suggestion;
}

export function getTasksByCategory(
  tasks: Task[],
  category: TaskCategory
): Task[] {
  return tasks.filter((t) => t.category === category);
}

export function getTasksByAssignee(tasks: Task[], assigneeId: string): Task[] {
  return tasks.filter((t) => t.assigned_to === assigneeId);
}

// Tool definitions for agent orchestration
export const taskAgentTools = [
  {
    name: 'get_tasks_due_today',
    description: 'Get all tasks due today',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_tasks_due_this_week',
    description: 'Get all tasks due in the next 7 days',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_overdue_tasks',
    description: 'Get all overdue tasks',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_mental_load',
    description: 'Get task distribution across family members',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'suggest_assignee',
    description: 'Suggest who should be assigned a new task based on current load',
    input_schema: {
      type: 'object' as const,
      properties: {
        taskCategory: { type: 'string', description: 'Category of the task' },
      },
      required: ['taskCategory'],
    },
  },
  {
    name: 'complete_task',
    description: 'Mark a task as completed',
    input_schema: {
      type: 'object' as const,
      properties: {
        taskId: { type: 'string' },
      },
      required: ['taskId'],
    },
  },
  {
    name: 'create_task',
    description: 'Create a new task',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string' },
        category: { type: 'string' },
        assignedTo: { type: 'string' },
        dueDate: { type: 'string' },
        isRecurring: { type: 'boolean' },
        recurrenceRule: { type: 'string' },
      },
      required: ['title', 'category'],
    },
  },
];
