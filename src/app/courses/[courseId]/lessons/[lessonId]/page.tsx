
import { getDb } from "@/lib/db";
import { type Lesson, type LessonStep, type Question } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { LessonPageClient } from "./client";

async function getLessonData(lessonId: string) {
    const db = await getDb();
    
    const lessonData = await db.get<Lesson>('SELECT * FROM lessons WHERE id = ?', lessonId);
    if (!lessonData) {
        return null;
    }

    const stepsData = await db.all<LessonStep[]>('SELECT * FROM lesson_steps WHERE lessonId = ? ORDER BY step_order', lessonId);
    const questionsData = await db.all<any[]>('SELECT * FROM questions WHERE lessonId = ? ORDER BY question_order', lessonId);
    const allCourseLessons = await db.all<Lesson[]>('SELECT * FROM lessons WHERE courseId = ?', lessonData.courseId);

    const lesson: Lesson = {
        ...lessonData,
        steps: stepsData,
        questions: questionsData.map(q => ({
            ...q,
            options: q.options ? JSON.parse(q.options) : [],
        }))
    }

    return { lesson, allCourseLessons };
}


export default async function LessonPage({ params }: { params: { lessonId: string }}) {
    const lessonData = await getLessonData(params.lessonId);
    
    if (!lessonData) {
        notFound();
    }

    return <LessonPageClient initialLesson={lessonData.lesson} allCourseLessons={lessonData.allCourseLessons} />;
}
