
/**
 * @fileOverview An AI flow for generating classroom insights for a teacher.
 *
 * - generateClassroomInsights - A function that creates a list of actionable insights for a teacher.
 */

import { ai } from '@/ai/genkit';
import { getClassroomAnalytics } from '../tools/get-classroom-analytics';
import { GenerateClassroomInsightsOutputSchema, type GenerateClassroomInsightsOutput } from './types';


// Exported wrapper function
export async function generateClassroomInsights(): Promise<GenerateClassroomInsightsOutput> {
  return generateClassroomInsightsFlow();
}

// Genkit Prompt
const prompt = ai.definePrompt({
  name: 'generateClassroomInsightsPrompt',
  output: { schema: GenerateClassroomInsightsOutputSchema },
  tools: [getClassroomAnalytics],
  prompt: `You are a helpful AI Teaching Assistant for the EduSpark platform. Your task is to analyze classroom data and provide a few brief, actionable insights for the teacher.

Use the getClassroomAnalytics tool to get the data.

Based on the analytics, generate 2-4 bullet points. Each insight should be concise and easy to understand. Frame the insights in a positive and encouraging manner.

Example insights:
- "Great engagement! Alex Doe is on a 2-day learning streak. Keep up the motivation!"
- "The 'Introduction to Algebra' lesson is very popular. Consider creating a follow-up assignment on this topic."
- "You might want to check in with Beth Smith, as they haven't completed any lessons yet."

Now, analyze the classroom data and generate your insights.`,
});

// Genkit Flow
const generateClassroomInsightsFlow = ai.defineFlow(
  {
    name: 'generateClassroomInsightsFlow',
    outputSchema: GenerateClassroomInsightsOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    if (!output) {
      throw new Error('AI failed to generate classroom insights.');
    }
    return output;
  }
);
