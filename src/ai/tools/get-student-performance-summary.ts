'use server';

import { ai } from '@/ai/genkit';
import { getDb } from '@/lib/db';
import { z } from 'zod';

const TopicPerformanceSchema = z.object({
    topicTitle: z.string(),
    correctPercentage: z.number().describe("The percentage of correct answers for this topic, from 0 to 100."),
    totalQuestions: z.number().describe("The total number of questions answered in this topic."),
});

const PerformanceSummarySchema = z.object({
    performanceByTopic: z.array(TopicPerformanceSchema),
});


export const getStudentPerformanceSummary = ai.defineTool(
  {
    name: 'getStudentPerformanceSummary',
    description: "Retrieves a student's quiz performance, summarized by topic.",
    inputSchema: z.object({
      userId: z.string().describe('The ID of the student.'),
    }),
    outputSchema: PerformanceSummarySchema,
  },
  async ({ userId }) => {
    try {
      const db = await getDb();
      const results = await db.all<z.infer<typeof TopicPerformanceSchema>[]>(`
        SELECT
            t.title as topicTitle,
            CAST(SUM(CASE WHEN uqa.isCorrect THEN 1 ELSE 0 END) AS REAL) * 100 / COUNT(uqa.id) as correctPercentage,
            COUNT(uqa.id) as totalQuestions
        FROM user_question_answers uqa
        JOIN questions q ON uqa.questionId = q.id
        JOIN lessons l ON q.lessonId = l.id
        JOIN topics t ON l.topicId = t.id
        WHERE uqa.userId = ?
        GROUP BY t.id, t.title
        ORDER BY t.title
      `, userId);

      return { performanceByTopic: results };
    } catch (error) {
      console.error('Tool Error: getStudentPerformanceSummary failed', error);
      return { performanceByTopic: [] };
    }
  }
);
