
import { getSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  type Course,
  type DailyAssignment,
  type Lesson,
} from "@/lib/mock-data";
import { StudentDashboardClient } from "./client";
import { generateNextLessonRecommendation } from "@/ai/flows/generate-next-lesson-recommendation-flow";


export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const db = await getDb();

  // Fetch dynamic stats
  const xpResult = await db.get(
    "SELECT SUM(xpEarned) as totalXp FROM user_progress WHERE userId = ?",
    session.id
  );
  const totalXp = xpResult?.totalXp || 0;

  const badgesResult = await db.get(
    "SELECT COUNT(*) as badgeCount FROM user_badges WHERE userId = ?",
    session.id
  );
  const badgesEarned = badgesResult?.badgeCount || 0;

  // Calculate streak
  const streakDatesResults = await db.all<{ date: string }[]>(
    'SELECT "date" FROM user_streaks WHERE userId = ? ORDER BY "date" DESC',
    session.id
  );
  const streakDates = streakDatesResults.map((r) => r.date);

  let dayStreak = 0;
  if (streakDates.length > 0) {
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // Use UTC to avoid timezone issues with date comparisons
    const lastDate = new Date(streakDates[0] + 'T00:00:00Z');

    if (
      lastDate.getTime() === today.getTime() ||
      lastDate.getTime() === yesterday.getTime()
    ) {
      currentStreak = 1;
      for (let i = 0; i < streakDates.length - 1; i++) {
        const currentDate = new Date(streakDates[i] + 'T00:00:00Z');
        const previousDate = new Date(streakDates[i + 1] + 'T00:00:00Z');

        const diffTime = currentDate.getTime() - previousDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak++;
        } else {
          break; // Streak is broken
        }
      }
    }
    dayStreak = currentStreak;
  }

  // Fetch count of assignments that are not submitted and not past due
  const assignmentsToDoResult = await db.get<{ count: number }>(`
    SELECT COUNT(a.id) as count
    FROM assignments a
    LEFT JOIN submissions s ON a.id = s.assignmentId AND s.userId = ?
    WHERE s.id IS NULL AND a.dueDate >= ?
  `, session.id, new Date().toISOString());
  
  const assignmentsToDo = assignmentsToDoResult?.count || 0;

  // Fetch other data
  const courses = await db.all<Omit<Course, 'Icon'>[]>("SELECT * FROM courses");

  // AI-powered "Continue Learning" card
  let recommendedLesson: (Lesson & { course: Omit<Course, 'Icon'>, reasoning: string }) | null = null;
  try {
    const recommendation = await generateNextLessonRecommendation({ userId: session.id });
    if (recommendation.lessonId && recommendation.courseId) {
        const recommendedLessonData = await db.get<Lesson>('SELECT * FROM lessons WHERE id = ?', recommendation.lessonId);
        const courseData = await db.get<Omit<Course, 'Icon'>>('SELECT * FROM courses WHERE id = ?', recommendation.courseId);

        if (recommendedLessonData && courseData) {
            recommendedLesson = {
                ...recommendedLessonData,
                course: courseData,
                reasoning: recommendation.reasoning,
                steps: [], // not needed for this view
                questions: [], // not needed for this view
            };
        }
    }
  } catch(e) {
      console.error("Failed to generate lesson recommendation for dashboard:", e);
      // Fail gracefully, card will show completion state.
  }


  return (
    <StudentDashboardClient
      user={session}
      stats={{ totalXp, dayStreak, badgesEarned }}
      courses={courses}
      assignmentsToDo={assignmentsToDo}
      recommendedLesson={recommendedLesson}
    />
  );
}
