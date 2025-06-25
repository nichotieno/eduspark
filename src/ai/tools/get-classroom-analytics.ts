'use server';

import { ai } from '@/ai/genkit';
import { getDb } from '@/lib/db';
import { z } from 'zod';

const ClassroomAnalyticsSchema = z.object({
    topStreaks: z.array(z.object({
        studentName: z.string(),
        streakDays: z.number(),
    })).describe("Students with the longest current learning streaks."),
    zeroProgressStudents: z.array(z.string()).describe("A list of student names who have not completed any lessons yet."),
    lessonCompletionStats: z.object({
        mostCompleted: z.array(z.string()).describe("Titles of the most frequently completed lessons."),
        leastCompleted: z.array(z.string()).describe("Titles of the least frequently completed lessons among all lessons."),
    }).describe("Statistics on lesson completion rates."),
});

export const getClassroomAnalytics = ai.defineTool(
  {
    name: 'getClassroomAnalytics',
    description: "Retrieves key analytics about the classroom, including student streaks, progress, and lesson completion rates.",
    inputSchema: z.object({}),
    outputSchema: ClassroomAnalyticsSchema,
  },
  async () => {
    const db = await getDb();

    // This is a simplified streak calculation. A real app would need more complex logic
    // to ensure the dates are consecutive.
    const streakCounts = await db.all<{ name: string, streakDays: number }>(`
        SELECT u.name, COUNT(us.date) as streakDays
        FROM users u
        JOIN user_streaks us ON u.id = us.userId
        WHERE u.role = 'student'
        GROUP BY u.id
        ORDER BY streakDays DESC
        LIMIT 3
    `);

    const zeroProgress = await db.all<{ name: string }>(`
        SELECT name FROM users u
        LEFT JOIN user_progress up ON u.id = up.userId
        WHERE u.role = 'student' AND up.userId IS NULL
    `);

    const completionStats = await db.all<{ title: string, completions: number }>(`
        SELECT l.title, COUNT(up.lessonId) as completions
        FROM lessons l
        LEFT JOIN user_progress up ON l.id = up.lessonId
        GROUP BY l.id
        ORDER BY completions DESC
    `);
    
    const mostCompleted = completionStats.length > 0 && completionStats[0].completions > 0 ? [completionStats[0].title] : [];
    const leastCompleted = completionStats.length > 1 && completionStats[completionStats.length - 1].completions < completionStats[0].completions ? [completionStats[completionStats.length - 1].title] : [];

    return {
      topStreaks: streakCounts.map(s => ({ studentName: s.name, streakDays: s.streakDays })),
      zeroProgressStudents: zeroProgress.map(s => s.name),
      lessonCompletionStats: {
        mostCompleted,
        leastCompleted,
      },
    };
  }
);
