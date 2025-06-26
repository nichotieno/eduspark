
/**
 * @fileOverview An AI flow for generating a hint from a tutor.
 *
 * - getTutorHint - A function that generates a hint for a quiz question.
 */

import {ai} from '@/ai/genkit';
import { GetTutorHintInputSchema, type GetTutorHintInput, GetTutorHintOutputSchema, type GetTutorHintOutput } from './types';

// Exported wrapper function
export async function getTutorHint(input: GetTutorHintInput): Promise<GetTutorHintOutput> {
  return getTutorHintFlow(input);
}

// Genkit Prompt
const prompt = ai.definePrompt({
  name: 'getTutorHintPrompt',
  input: { schema: GetTutorHintInputSchema },
  output: { schema: GetTutorHintOutputSchema },
  prompt: `You are an encouraging and helpful AI Tutor for a STEM learning platform. A student is asking for a hint on a quiz question.

Your goal is to guide the student towards the correct answer without giving it away directly. Use the Socratic method: ask leading questions, suggest a first step, or explain a key concept related to the problem. Be friendly and supportive.

Lesson Title: {{{lessonTitle}}}
Question: "{{{questionText}}}"
{{#if questionOptions}}
Options:
{{#each questionOptions}}
- {{{this}}}
{{/each}}
{{/if}}

Provide a concise hint to help the student think through the problem.`,
});

// Genkit Flow
const getTutorHintFlow = ai.defineFlow(
  {
    name: 'getTutorHintFlow',
    inputSchema: GetTutorHintInputSchema,
    outputSchema: GetTutorHintOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a hint.");
    }
    return output;
  }
);
