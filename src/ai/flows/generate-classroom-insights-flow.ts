'use server';
/**
 * @fileOverview An AI flow for generating classroom insights for a teacher.
 *
 * - generateClassroomInsights - A function that creates a list of actionable insights for a teacher.
 * - GenerateClassroomInsightsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getClassroomAnalytics } from '../tools/get-classroom-analytics';

// Output Schema
const GenerateClassroomInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe("A list of 2-4 brief, actionable, and encouraging insights for the teacher based on the provided classroom analytics. The tone should be helpful and professional, like a teaching assistant."),
});
export type GenerateClassroomInsightsOutput = z.infer<
  typeof GenerateClassroomInsightsOutputSchema
>;

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
