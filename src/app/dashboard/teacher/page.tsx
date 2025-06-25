import { getDb } from '@/lib/db';
import { TeacherDashboardClient } from './client';
import type { Course, Topic, Lesson, DailyAssignment, RecentSubmission, CourseEnrollment } from "@/lib/mock-data";
import type { User } from '@/lib/definitions';
import { formatDistanceToNow } from 'date-fns';
import { generateClassroomInsights } from '@/ai/flows/generate-classroom-insights-flow';

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
    const [courses, topics, lessons, assignmentsData, students, courseEnrollmentsData, recentSubmissionsData, aiInsights] = await Promise.all([
      db.all<Omit<Course, 'Icon'>[]>('SELECT * FROM courses'),
      db.all<Topic[]>('SELECT * FROM topics'),
      db.all<Lesson[]>('SELECT * FROM lessons'),
      db.all('SELECT * FROM assignments ORDER BY dueDate DESC'),
      db.all<User[]>('SELECT id, name, avatarUrl FROM users WHERE role = "student"'),
      db.all<CourseEnrollment[]>(`
          SELECT 
              c.id as courseId, 
              c.title as courseTitle, 
              COUNT(DISTINCT up.userId) as enrolledStudents
          FROM courses c
          LEFT JOIN lessons l ON c.id = l.courseId
          LEFT JOIN user_progress up ON l.id = up.lessonId
          GROUP BY c.id, c.title
      `),
      db.all<RecentSubmission[]>(`
          SELECT 
              s.id, 
              s.submittedAt,
              u.name as studentName,
              u.avatarUrl as studentAvatarUrl,
              a.title as assignmentTitle
          FROM submissions s
          JOIN users u ON s.userId = u.id
          JOIN assignments a ON s.assignmentId = a.id
          ORDER BY s.submittedAt DESC
          LIMIT 5
      `),
      generateClassroomInsights().catch(err => {
          console.error("AI Insight generation failed:", err);
          return null; // Gracefully handle AI errors
      })
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

    const totalProgress = studentProgressList.reduce((acc, student) => acc + student.progress, 0);
    const averageProgress = students.length > 0 ? Math.round(totalProgress / students.length) : 0;

    return (
      <TeacherDashboardClient
        initialCourses={courses}
        initialTopics={topics}
        initialLessons={lessons}
        initialAssignments={assignments}
        initialStudents={studentProgressList}
        analytics={{
            totalStudents: students.length,
            averageProgress: averageProgress,
            courseEnrollments: courseEnrollmentsData,
            recentSubmissions: recentSubmissionsData,
        }}
        aiInsights={aiInsights}
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
