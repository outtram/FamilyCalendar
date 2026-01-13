import { client } from '@/lib/claude';
import { calendarAgentTools } from './calendar-agent';
import { mealAgentTools } from './meal-agent';
import { taskAgentTools } from './task-agent';

// Combine all agent tools
const allTools = [
  ...calendarAgentTools,
  ...mealAgentTools,
  ...taskAgentTools,
];

const ORCHESTRATOR_SYSTEM = `You are the Family Command Centre orchestrator for the Outtram family.

Your role is to coordinate between specialized agents to answer family queries:
- Calendar Agent: Handles availability checks, shift scheduling, calendar conflicts
- Meal Agent: Suggests meals, tracks preferences, manages meal planning
- Task Agent: Manages chores, tracks mental load, handles recurring tasks

Family context:
- Troy: Partner at Big 4 consulting, works from home often
- Lex: Midwife, picks up extra shifts at hospital, primary user
- Luke (21): University student, helps with chores
- Charlie (17): High school student, helps with chores
- Location: Melbourne, Australia (AEST timezone)

Key workflows:
1. SOS Shift Check: When Lex gets a shift request, quickly check if the day is clear
2. Meal Planning: Consider who's home, recent meals, and family preferences
3. Task Distribution: Balance mental load fairly across family members

Always be concise and helpful. Focus on actionable information.`;

export interface OrchestratorQuery {
  query: string;
  userId: string;
  context?: Record<string, unknown>;
}

export interface OrchestratorResponse {
  answer: string;
  toolsUsed: string[];
  confidence: number;
}

export async function orchestrate(
  input: OrchestratorQuery
): Promise<OrchestratorResponse> {
  const toolsUsed: string[] = [];

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: ORCHESTRATOR_SYSTEM,
    tools: allTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.input_schema,
    })),
    messages: [
      {
        role: 'user',
        content: `User: ${input.userId}\nQuery: ${input.query}${
          input.context ? `\nContext: ${JSON.stringify(input.context)}` : ''
        }`,
      },
    ],
  });

  // Process tool calls if any
  for (const block of response.content) {
    if (block.type === 'tool_use') {
      toolsUsed.push(block.name);
      // In production, would execute the tool and continue conversation
    }
  }

  // Extract text response
  const textBlock = response.content.find((b) => b.type === 'text');
  const answer = textBlock?.type === 'text' ? textBlock.text : 'Unable to process query';

  return {
    answer,
    toolsUsed,
    confidence: toolsUsed.length > 0 ? 0.9 : 0.7,
  };
}

// Common query shortcuts
export async function checkShiftAvailability(date: string, userId: string) {
  return orchestrate({
    query: `Can Lex pick up a shift on ${date}? Give a quick yes/no with any conflicts.`,
    userId,
  });
}

export async function getDailySummary(userId: string) {
  return orchestrate({
    query: 'Give me today\'s summary: any calendar conflicts, tasks due, and dinner situation.',
    userId,
  });
}

export async function suggestDinner(
  date: string,
  whoIsHome: string[],
  userId: string
) {
  return orchestrate({
    query: `Suggest dinner for ${date}. People home: ${whoIsHome.join(', ')}`,
    userId,
    context: { whoIsHome },
  });
}
