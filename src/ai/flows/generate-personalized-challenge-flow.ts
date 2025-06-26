
/**
 * @fileOverview An AI flow for generating a personalized daily challenge for a student.
 *
 * - generatePersonalizedChallenge - A function that creates a unique challenge based on a student's learning history.
 */

import { ai } from '@/ai/genkit';
import { getStudentLearningHistory } from '../tools/get-student-learning-history';
import { GeneratePersonalizedChallengeInputSchema, type GeneratePersonalizedChallengeInput, GeneratePersonalizedChallengeOutputSchema, type GeneratePersonalizedChallengeOutput } from './types';


// Exported wrapper function
export async function generatePersonalizedChallenge(
  input: GeneratePersonalizedChallengeInput
): Promise<GeneratePersonalizedChallengeOutput> {
  return generatePersonalizedChallengeFlow(input);
}

// Genkit Prompt
const prompt = ai.definePrompt({
  name: 'generatePersonalizedChallengePrompt',
  input: { schema: GeneratePersonalizedChallengeInputSchema },
  output: { schema: GeneratePersonalizedChallengeOutputSchema },
  tools: [getStudentLearningHistory],
  prompt: `You are an expert curriculum designer who creates engaging, personalized daily challenges for a STEM learning platform.

Your task is to generate a unique and interesting daily challenge for a student. The challenge should be relevant to the topics they have recently studied to reinforce their learning. Use the getStudentLearningHistory tool to find out what the student has been learning.

If the student has no learning history, create a fun, general-interest science or math problem suitable for a high school student.

The problem should be a short word problem or a conceptual question that requires some thought. Avoid simple "what is X" questions.

Based on the student's learning history, generate a challenge and respond in the required JSON format.

User ID: {{{userId}}}`,
});

// Genkit Flow
const generatePersonalizedChallengeFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedChallengeFlow',
    inputSchema: GeneratePersonalizedChallengeInputSchema,
    outputSchema: GeneratePersonalizedChallengeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a personalized challenge.');
    }
    return output;
  }
);
