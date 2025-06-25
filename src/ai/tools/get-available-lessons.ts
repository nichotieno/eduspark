'use server';

import { ai } from '@/ai/genkit';
import { getDb } from '@/lib/db';
import { z } from 'zod';

const AvailableLessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  courseId: z.string(),
  topicTitle: z.string(),
});

export const getAvailableLessons = ai.defineTool(
  {
    name: 'getAvailableLessons',
    description: "Gets a list of all lessons that a student has not yet completed.",
    inputSchema: z.object({
      userId: z.string().describe('The ID of the student.'),
    }),
    outputSchema: z.object({
      lessons: z.array(AvailableLessonSchema).describe("The list of available lessons."),
    }),
  },
  async ({ userId }) => {
    try {
      const db = await getDb();
      const results = await db.all<z.infer<typeof AvailableLessonSchema>[]>(`
        SELECT
            l.id,
            l.title,
            l.courseId,
            t.title as topicTitle
        FROM lessons l
        JOIN topics t ON l.topicId = t.id
        WHERE l.id NOT IN (SELECT lessonId FROM user_progress WHERE userId = ?)
        ORDER BY l.id
      `, userId);

      return { lessons: results };
    } catch (error) {
      console.error('Tool Error: getAvailableLessons failed', error);
      return { lessons: [] };
    }
  }
);
