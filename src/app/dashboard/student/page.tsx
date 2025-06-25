
import { getSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  type Course,
  type DailyAssignment,
  type Lesson,
} from "@/lib/mock-data";
import { BookOpen, Calculator, FlaskConical } from "lucide-react";
import { StudentDashboardClient } from "./client";


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

  // Fetch other data
  const courses = await db.all<Course[]>("SELECT * FROM courses");
  const lessons = await db.all<Lesson[]>("SELECT * FROM lessons");
  const assignmentsData = await db.all(
    "SELECT * FROM assignments WHERE dueDate > ?",
    new Date().toISOString()
  );
  const assignments = assignmentsData.map((a) => ({
    ...a,
    dueDate: new Date(a.dueDate),
  }));

  // Re-hydrate Icon components
  const coursesWithIcons = courses.map((c: any) => {
    let IconComponent = BookOpen;
    if (c.id === "math") IconComponent = Calculator;
    else if (c.id === "science") IconComponent = FlaskConical;
    return { ...c, Icon: IconComponent };
  });

  return (
    <StudentDashboardClient
      user={session}
      stats={{ totalXp, dayStreak, badgesEarned }}
      courses={coursesWithIcons}
      lessons={lessons}
      assignments={assignments}
    />
  );
}
