import { getDb } from '@/lib/db';
import { TeacherDashboardClient } from './client';
import type { Course, Topic, Lesson, DailyAssignment } from "@/lib/mock-data";
import { BookOpen, Calculator, FlaskConical } from 'lucide-react';

export default async function TeacherDashboard() {
  const db = await getDb();

  let courses: Course[] = [];
  let topics: Topic[] = [];
  let lessons: Lesson[] = [];
  let assignments: DailyAssignment[] = [];
  
  try {
    courses = await db.all('SELECT * FROM courses');
    topics = await db.all('SELECT * FROM topics');
    lessons = await db.all('SELECT * FROM lessons');
    const assignmentsData = await db.all('SELECT * FROM assignments');
    assignments = assignmentsData.map(a => ({...a, dueDate: new Date(a.dueDate)}));

    // Re-hydrate Icon components after fetching from DB
    courses = courses.map((course: any) => {
        let IconComponent = BookOpen;
        if (course.id === "math") {
            IconComponent = Calculator;
        } else if (course.id === "science") {
            IconComponent = FlaskConical;
        }
        return { ...course, Icon: IconComponent };
    });
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

  return (
    <TeacherDashboardClient
      initialCourses={courses}
      initialTopics={topics}
      initialLessons={lessons}
      initialAssignments={assignments}
    />
  );
}
