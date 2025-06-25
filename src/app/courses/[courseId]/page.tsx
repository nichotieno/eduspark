
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";
import {
  type Course,
  type Lesson,
  type Topic,
} from "@/lib/mock-data";
import { notFound, redirect } from "next/navigation";
import { BookOpen, Calculator, FlaskConical } from "lucide-react";
import { CoursePageClient } from "./client";

async function getCourseData(courseId: string, userId: string) {
    const db = await getDb();

    // Fetch course details
    const course = await db.get<Course>('SELECT * FROM courses WHERE id = ?', courseId);
    if (!course) return null;

    // Add Icon component
    let IconComponent = BookOpen;
    if (course.id === "math") IconComponent = Calculator;
    else if (course.id === "science") IconComponent = FlaskConical;
    const courseWithIcon = { ...course, Icon: IconComponent };

    // Fetch related data in parallel
    const [topics, lessons, userProgress] = await Promise.all([
        db.all<Topic[]>('SELECT * FROM topics WHERE courseId = ?', courseId),
        db.all<Lesson[]>('SELECT * FROM lessons WHERE courseId = ?', courseId),
        db.all<{ lessonId: string }[]>('SELECT lessonId FROM user_progress WHERE userId = ?', userId),
    ]);

    // Create a map for quick lookup of completed lessons
    const completedLessons = userProgress.reduce((acc, progress) => {
        acc[progress.lessonId] = true;
        return acc;
    }, {} as Record<string, boolean>);
    
    return {
        course: courseWithIcon,
        topics,
        lessons,
        completedLessons,
    };
}


export default async function CoursePage({ params }: { params: { courseId: string } }) {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    const data = await getCourseData(params.courseId, session.id);

    if (!data) {
        notFound();
    }

    return (
        <CoursePageClient 
            course={data.course}
            topics={data.topics}
            lessons={data.lessons}
            completedLessons={data.completedLessons}
        />
    );
}
