import { getDb } from '@/lib/db';
import { TeacherDashboardClient } from './client';
import type { Course, Topic, Lesson, DailyAssignment } from "@/lib/mock-data";
import type { User } from '@/lib/definitions';
import { formatDistanceToNow } from 'date-fns';

type StudentProgress = {
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  progress: number;
  lastActive: string;
};

export default async function TeacherDashboard() {
  const db = await getDb();

  try {
    const [courses, topics, lessons, assignmentsData, students] = await Promise.all([
      db.all<Course[]>('SELECT * FROM courses'),
      db.all<Topic[]>('SELECT * FROM topics'),
      db.all<Lesson[]>('SELECT * FROM lessons'),
      db.all('SELECT * FROM assignments'),
      db.all<User[]>('SELECT id, name, avatarUrl FROM users WHERE role = "student"')
    ]);
    
    const assignments = assignmentsData.map(a => ({...a, dueDate: new Date(a.dueDate)}));
    const totalLessonsCount = lessons.length;

    const studentProgressList: StudentProgress[] = await Promise.all(
      students.map(async (student) => {
        const progressResult = await db.get<{ count: number }>(
          'SELECT COUNT(*) as count FROM user_progress WHERE userId = ?',
          student.id
        );
        const completedLessons = progressResult?.count || 0;
        const progress = totalLessonsCount > 0 ? Math.round((completedLessons / totalLessonsCount) * 100) : 0;

        const lastStreakResult = await db.get<{ date: string }>(
          'SELECT "date" FROM user_streaks WHERE userId = ? ORDER BY "date" DESC LIMIT 1',
          student.id
        );
        const lastActive = lastStreakResult ? formatDistanceToNow(new Date(lastStreakResult.date), { addSuffix: true }) : 'Never';

        return {
          studentId: student.id,
          studentName: student.name,
          avatarUrl: student.avatarUrl,
          progress,
          lastActive,
        };
      })
    );

    return (
      <TeacherDashboardClient
        initialCourses={courses}
        initialTopics={topics}
        initialLessons={lessons}
        initialAssignments={assignments}
        initialStudents={studentProgressList}
      />
    );

  } catch (error) {
    console.error("Database query failed", error);
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-destructive mb-4">Database Error</h1>
            <p>Could not connect to the database.</p>
            <p className="mt-2 text-sm text-muted-foreground">Please make sure you have run <code className="bg-muted px-2 py-1 rounded">npm run db:seed</code></p>
        </div>
    )
  }
}
