'use server';
/**
 * @fileOverview An AI flow for recommending the next lesson for a student.
 *
 * - generateNextLessonRecommendation - A function that recommends the best next lesson based on performance.
 */

import { ai } from '@/ai/genkit';
import { getStudentPerformanceSummary } from '../tools/get-student-performance-summary';
import { getAvailableLessons } from '../tools/get-available-lessons';
import { GenerateNextLessonRecommendationInputSchema, type GenerateNextLessonRecommendationInput, GenerateNextLessonRecommendationOutputSchema, type GenerateNextLessonRecommendationOutput } from './types';


// Exported wrapper function
export async function generateNextLessonRecommendation(
  input: GenerateNextLessonRecommendationInput
): Promise<GenerateNextLessonRecommendationOutput> {
  return generateNextLessonRecommendationFlow(input);
}

// Genkit Prompt
const prompt = ai.definePrompt({
  name: 'generateNextLessonRecommendationPrompt',
  input: { schema: GenerateNextLessonRecommendationInputSchema },
  output: { schema: GenerateNextLessonRecommendationOutputSchema },
  tools: [getStudentPerformanceSummary, getAvailableLessons],
  prompt: `You are an expert curriculum advisor for the EduSpark learning platform. Your task is to recommend the best next lesson for a student based on their quiz performance and the lessons they have yet to complete.

Your logic should be:
1.  First, use the \`getStudentPerformanceSummary\` tool to analyze the student's quiz history. This will show you which topics they excel at and which they struggle with.
2.  Next, use the \`getAvailableLessons\` tool to get a list of all lessons the student has not yet completed.
3.  If the student is struggling with a topic (e.g., less than 70% correct answers), recommend an introductory-level lesson from that topic that is in their list of available lessons.
4.  If the student is performing well across all topics (or has no performance history), recommend the next logical lesson from the available list.
5.  If there are no available lessons left, state that the student has completed all lessons.
6.  You must provide a brief, encouraging, one-sentence \`reasoning\` for your choice to be shown to the student.

Example Reasoning:
- "Let's reinforce your algebra skills with this next lesson!"
- "You're doing great! Time for a new challenge in geometry."
- "You've mastered everything! Great work."

Now, analyze the student's data and recommend the next lesson.

User ID: {{{userId}}}`,
});

// Genkit Flow
const generateNextLessonRecommendationFlow = ai.defineFlow(
  {
    name: 'generateNextLessonRecommendationFlow',
    inputSchema: GenerateNextLessonRecommendationInputSchema,
    outputSchema: GenerateNextLessonRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a lesson recommendation.');
    }
    return output;
  }
);
