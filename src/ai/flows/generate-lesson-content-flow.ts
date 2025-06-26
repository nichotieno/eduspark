
/**
 * @fileOverview An AI flow for generating lesson content.
 *
 * - generateLessonContent - A function that creates steps and questions for a lesson.
 */

import {ai} from '@/ai/genkit';
import { GenerateLessonContentInputSchema, type GenerateLessonContentInput, GenerateLessonContentOutputSchema, type GenerateLessonContentOutput } from './types';

// Exported wrapper function
export async function generateLessonContent(input: GenerateLessonContentInput): Promise<GenerateLessonContentOutput> {
  return generateLessonContentFlow(input);
}

// Genkit Prompt
const prompt = ai.definePrompt({
  name: 'generateLessonContentPrompt',
  input: { schema: GenerateLessonContentInputSchema },
  output: { schema: GenerateLessonContentOutputSchema },
  prompt: `You are an expert curriculum designer for STEM subjects. Your task is to generate a complete lesson plan based on the provided title. The lesson plan should consist of several learning steps and a quiz.

- The learning steps should break down the complex topic into 3-4 easy-to-understand parts.
- The quiz should contain 3-5 questions, including a mix of multiple-choice and fill-in-the-blank types.
- For multiple-choice questions, provide 4 plausible options.
- The correct answer must be one of the provided options for multiple-choice questions.
- Provide a helpful hint for every question.
- The content should be engaging, clear, and suitable for a high school audience.
- The final output MUST strictly conform to the provided JSON schema.

Lesson Title: {{{title}}}`,
});

// Genkit Flow
const generateLessonContentFlow = ai.defineFlow(
  {
    name: 'generateLessonContentFlow',
    inputSchema: GenerateLessonContentInputSchema,
    outputSchema: GenerateLessonContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate lesson content.");
    }
    return output;
  }
);
