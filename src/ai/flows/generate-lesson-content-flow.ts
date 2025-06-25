'use server';
/**
 * @fileOverview An AI flow for generating lesson content.
 *
 * - generateLessonContent - A function that creates steps and questions for a lesson.
 * - GenerateLessonContentInput - The input type for the function.
 * - GenerateLessonContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const GenerateLessonContentInputSchema = z.object({
  title: z.string().describe('The title of the lesson to generate content for.'),
});
export type GenerateLessonContentInput = z.infer<typeof GenerateLessonContentInputSchema>;

// Output Schema
const LessonStepSchema = z.object({
    title: z.string().describe("The title of this learning step."),
    content: z.string().describe("The detailed content for this learning step, written in a clear and engaging way."),
});

const QuestionSchema = z.object({
    text: z.string().describe("The text of the quiz question."),
    type: z.enum(['multiple-choice', 'fill-in-the-blank']).describe("The type of the question."),
    options: z.array(z.string()).describe("An array of possible answers for multiple-choice questions. Should be empty for fill-in-the-blank."),
    correctAnswer: z.string().describe("The correct answer to the question."),
    hint: z.string().describe("A helpful hint for the student."),
});

const GenerateLessonContentOutputSchema = z.object({
  steps: z.array(LessonStepSchema).describe("An array of learning steps for the lesson."),
  questions: z.array(QuestionSchema).describe("An array of quiz questions to test understanding."),
});
export type GenerateLessonContentOutput = z.infer<typeof GenerateLessonContentOutputSchema>;

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
