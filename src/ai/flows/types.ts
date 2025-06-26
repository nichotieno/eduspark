
import { z } from 'genkit';

// From generate-classroom-insights-flow.ts
export const GenerateClassroomInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe("A list of 2-4 brief, actionable, and encouraging insights for the teacher based on the provided classroom analytics. The tone should be helpful and professional, like a teaching assistant."),
});
export type GenerateClassroomInsightsOutput = z.infer<
  typeof GenerateClassroomInsightsOutputSchema
>;

// From generate-lesson-content-flow.ts
export const GenerateLessonContentInputSchema = z.object({
  title: z.string().describe('The title of the lesson to generate content for.'),
});
export type GenerateLessonContentInput = z.infer<typeof GenerateLessonContentInputSchema>;

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

export const GenerateLessonContentOutputSchema = z.object({
  steps: z.array(LessonStepSchema).describe("An array of learning steps for the lesson."),
  questions: z.array(QuestionSchema).describe("An array of quiz questions to test understanding."),
});
export type GenerateLessonContentOutput = z.infer<typeof GenerateLessonContentOutputSchema>;

// From generate-next-lesson-recommendation-flow.ts
export const GenerateNextLessonRecommendationInputSchema = z.object({
  userId: z.string().describe("The ID of the student."),
});
export type GenerateNextLessonRecommendationInput = z.infer<typeof GenerateNextLessonRecommendationInputSchema>;

export const GenerateNextLessonRecommendationOutputSchema = z.object({
  lessonId: z.string().optional().describe("The ID of the recommended lesson."),
  courseId: z.string().optional().describe("The course ID of the recommended lesson."),
  reasoning: z.string().describe("A brief, one-sentence explanation for the recommendation to show to the student."),
});
export type GenerateNextLessonRecommendationOutput = z.infer<typeof GenerateNextLessonRecommendationOutputSchema>;


// From generate-personalized-challenge-flow.ts
export const GeneratePersonalizedChallengeInputSchema = z.object({
  userId: z
    .string()
    .describe('The ID of the student for whom to generate the challenge.'),
});
export type GeneratePersonalizedChallengeInput = z.infer<
  typeof GeneratePersonalizedChallengeInputSchema
>;

export const GeneratePersonalizedChallengeOutputSchema = z.object({
  title: z.string().describe('A short, catchy title for the challenge.'),
  problem: z
    .string()
    .describe(
      'The full text of the challenge problem. It should be a word problem or a conceptual question.'
    ),
  topic: z
    .string()
    .describe(
      "The general STEM topic of the challenge (e.g., 'Algebra', 'Biology', 'Physics')."
    ),
});
export type GeneratePersonalizedChallengeOutput = z.infer<
  typeof GeneratePersonalizedChallengeOutputSchema
>;

// From get-tutor-hint-flow.ts
export const GetTutorHintInputSchema = z.object({
  lessonTitle: z.string().describe('The title of the lesson.'),
  questionText: z.string().describe('The text of the question the student is stuck on.'),
  questionOptions: z.array(z.string()).describe('The multiple-choice options for the question, if any.'),
});
export type GetTutorHintInput = z.infer<typeof GetTutorHintInputSchema>;

export const GetTutorHintOutputSchema = z.object({
  hintText: z.string().describe("A helpful, Socratic-style hint for the student. It should not give the direct answer."),
});
export type GetTutorHintOutput = z.infer<typeof GetTutorHintOutputSchema>;
