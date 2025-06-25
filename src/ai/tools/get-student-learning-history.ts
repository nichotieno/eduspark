'use server';

import { ai } from '@/ai/genkit';
import { getDb } from '@/lib/db';
import { z } from 'zod';

export const getStudentLearningHistory = ai.defineTool(
  {
    name: 'getStudentLearningHistory',
    description: "Gets the student's most recently completed learning topics.",
    inputSchema: z.object({
      userId: z.string().describe('The ID of the student.'),
    }),
    outputSchema: z.object({
      topics: z
        .array(z.string())
        .describe(
          'A list of the unique topic titles the student has recently completed lessons in.'
        ),
    }),
  },
  async ({ userId }) => {
    try {
      const db = await getDb();
      // Get the last 3 unique topics the user completed a lesson in.
      const results = await db.all<{ title: string }>(
        `
        SELECT DISTINCT t.title
        FROM user_progress up
        JOIN lessons l ON up.lessonId = l.id
        JOIN topics t ON l.topicId = t.id
        WHERE up.userId = ?
        ORDER BY up.completedAt DESC
        LIMIT 3
      `,
        userId
      );

      const topics = results.map((r) => r.title);
      return { topics };
    } catch (error) {
      console.error('Tool Error: getStudentLearningHistory failed', error);
      // Return empty array on error to allow the flow to continue gracefully
      return { topics: [] };
    }
  }
);
